import { EventsRepository } from 'src/domain/repositories/events.repository';
import { EventEntity } from 'src/domain/entities/event.entity';
import { CreateEventDto } from 'src/application/dtos/events/create-event.dto';
import { QueryOptions } from 'src/application/dtos/shared/query-options.dto';
import { Prisma } from 'generated/prisma';
import { PrismaEventMapper } from 'src/infrastructure/mappers/prisma.event.mapper';
import { PrismaService } from './prisma.service';
import { CategoryEntity } from 'src/domain/entities/category.entity';

export type EventRelations = keyof Prisma.EventInclude;
export type EventQueryOptions = QueryOptions<EventEntity>;

export interface Includes {
    categories: boolean;
    organizer: boolean;
}

export class PrismaEventsRepository
    extends PrismaService<EventEntity, Prisma.EventFindManyArgs>
    implements EventsRepository
{
    async create(data: CreateEventDto): Promise<EventEntity> {
        const {
            title,
            start_time,
            end_time,
            creator_id,
            lat,
            lng,
            locationAddress,
            categories,
            location_id,
        } = data;

        const _event = await this.event.create({
            data: {
                title,
                creator_id,
                start_time,
                end_time,
                location: locationAddress,
                lat,
                lng,
                location_id,
            },
        });

        if (categories) {
            await this.eventCategories.createMany({
                data: categories.map((category) => ({
                    category_id: category,
                    event_id: _event.id,
                })),
            });
        }

        return PrismaEventMapper.toEntity(_event);
    }

    async findById(id: number): Promise<EventEntity | null> {
        const event = await this.event.findUnique({ where: { id } });
        return event ? PrismaEventMapper.toEntity(event) : null;
    }

    async findAll(queryOptions?: EventQueryOptions): Promise<EventEntity[]> {
        const _events = await this.event.findMany(
            this.buildQuery(queryOptions),
        );

        return _events.map(PrismaEventMapper.toEntity);
    }

    async findNearby(
        lat: number,
        lng: number,
        radiusInKm: number,
        options?: EventQueryOptions,
    ): Promise<EventEntity[]> {
        // Use PostGIS to find events within radius, ordered by distance
        const events = (await this.$queryRaw`
            SELECT 
                e.*,
                ST_DistanceSphere(
                    ST_MakePoint(e.lng, e.lat),
                    ST_MakePoint(${lng}, ${lat})
                ) as distance_meters
            FROM 
                events e
            WHERE 
                e.lng IS NOT NULL 
                AND e.lat IS NOT NULL
                AND ST_DWithin(
                    ST_SetSRID(ST_MakePoint(e.lng, e.lat), 4326)::geography,
                    ST_SetSRID(ST_MakePoint(${lng}, ${lat}), 4326)::geography,
                    ${radiusInKm * 1000}
                )
            ORDER BY 
                distance_meters
            ${options?.limit ? Prisma.sql`LIMIT ${options.limit}` : Prisma.empty}
            ${options?.offset ? Prisma.sql`OFFSET ${options.offset}` : Prisma.empty}
        `) as any[];

        // If no include options, return mapped events directly
        if (!options?.include || options.include.length === 0) {
            return events.map(PrismaEventMapper.toEntity);
        }

        // If include is needed, fetch full event data with relations
        const eventIds = events.map((e) => e.id);
        if (eventIds.length === 0) {
            return [];
        }

        const fullEvents = await this.event.findMany({
            where: { id: { in: eventIds } },
            ...this.buildQuery(options),
        });

        // Preserve the order from the PostGIS query
        const eventMap = new Map(fullEvents.map((e) => [e.id, e]));
        const orderedEvents = eventIds
            .map((id) => eventMap.get(id))
            .filter((e) => e !== undefined);

        return orderedEvents.map(PrismaEventMapper.toEntity);
    }

    async listAvailableCategories(): Promise<CategoryEntity[]> {
        return await this.category.findMany();
    }

    async deleteById(id: number): Promise<void> {
        await this.event.delete({ where: { id } });
    }
}
