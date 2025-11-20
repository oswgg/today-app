import { Inject } from '@nestjs/common';
import { EventEntity } from 'src/domain/entities/event.entity';
import {
    EVENTS_REPOSITORY_TOKEN,
    EventsRepository,
} from 'src/domain/repositories/events.repository';
import { boundingBox } from 'src/domain/shared/utils/bounding-box';
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
        // themselves. If position is provided we build location filters, but
        // if not provided we must NOT force location filtering so callers can
        // list events without providing position (e.g. filter only by creator).
        const hasPosition = typeof lat === 'number' && typeof lng === 'number';

        const bounding = hasPosition
            ? boundingBox(lat as number, lng as number, radius)
            : undefined;

        const locationWhere =
            hasPosition && bounding
                ? {
                      lat: {
                          operator: 'between' as const,
                          value: [bounding.min_lat, bounding.max_lat],
                      },
                      lng: {
                          operator: 'between' as const,
                          value: [bounding.min_lng, bounding.max_lng],
                      },
                  }
                : undefined;

        // Merge location filters (only if we have position) with any other
        // filters provided via `filters.where`. If neither exists,
        // pass `undefined` so repository won't filter by location.
        const filtersWhere = filters?.where ?? undefined;

        const mergedWhere =
            locationWhere || filtersWhere
                ? {
                      ...(locationWhere ?? {}),
                      ...(filtersWhere ?? {}),
                  }
                : undefined;

        return await this.eventsRepository.findAll({
            where: mergedWhere,
            include: [
                {
                    model: 'creator',
                    select: ['id', 'name'],
                },
                {
                    model: 'categories',
                    include: [
                        {
                            model: 'category',
                            select: ['id', 'name', 'description'],
                        },
                    ],
                },
            ],
            // Merge other query options (select, sort, limit, offset) if provided
            ...(filters?.select && {
                select: filters.select,
            }),
            ...(filters?.sort && { sort: filters.sort }),
            ...(filters?.limit && { limit: filters.limit }),
            ...(filters?.offset && {
                offset: filters.offset,
            }),
        });
    }
}
