import { Inject } from '@nestjs/common';
import { EventEntity } from 'src/domain/entities/event.entity';
import {
    EVENTS_REPOSITORY_TOKEN,
    EventsRepository,
} from 'src/domain/repositories/events.repository';
import { QueryOptions } from 'src/application/dtos/shared/query-options.dto';

export interface ListAllEventsOptions {
    /** User's current latitude (optional - used for proximity filtering) */
    lat?: number;
    /** User's current longitude (optional - used for proximity filtering) */
    lng?: number;
    /** Search radius in kilometers (default: 5km) */
    radius?: number;
    /** Additional query filters, sorting, pagination, etc. */
    filters?: QueryOptions<EventEntity>;
}

export class ListAllEvents {
    constructor(
        @Inject(EVENTS_REPOSITORY_TOKEN)
        private readonly eventsRepository: EventsRepository,
    ) {}

    async execute(options: ListAllEventsOptions = {}): Promise<EventEntity[]> {
        const { lat, lng, radius = 5, filters } = options;

        // Determine whether we have a user position (lat/lng) — these are
        // positional inputs used to compute a bounding box, NOT query filters
        // themselves. If position is provided we use findNearby (PostGIS),
        // if not provided we use findAll with standard filters
        const hasPosition =
            typeof lat === 'number' &&
            typeof lng === 'number' &&
            !isNaN(lat) &&
            !isNaN(lng);

        // Include configuration for both queries
        const includeConfig = [
            {
                model: 'creator',
                select: ['id', 'name'],
                where: filters?.where?.creator,
                required: !!filters?.where?.creator,
                relation: 'one' as const,
            },
            {
                model: 'categories',
                relation: 'many' as const,
                include: [
                    {
                        model: 'category',
                        select: ['id', 'name', 'description'],
                        where: filters?.where?.categories,
                        required: !!filters?.where?.categories,
                        relation: 'one' as const,
                    },
                ],
            },
        ];

        // Excluir filtros de relaciones del where principal
        const { creator, categories, ...mainWhere } = filters?.where || {};

        // Build query options from filters
        const queryOptions: QueryOptions<EventEntity> = {
            include: includeConfig,
            ...(filters?.select && { select: filters.select }),
            ...(filters?.sort && { sort: filters.sort }),
            ...(filters?.limit && { limit: filters.limit }),
            ...(filters?.offset && { offset: filters.offset }),
            ...(Object.keys(mainWhere).length > 0 && { where: mainWhere }),
        };

        // If we have position, use PostGIS-based findNearby
        if (hasPosition) {
            return await this.eventsRepository.findNearby(
                lat as number,
                lng as number,
                radius,
                queryOptions,
            );
        }

        // Otherwise use standard findAll with optional filters
        return await this.eventsRepository.findAll(queryOptions);
    }
}
