import { VenueRepository } from 'src/domain/repositories/venue.repository';
import { PrismaService } from './prisma.service';
import { VenueEntity } from 'src/domain/entities/venue.entity';
import { Prisma } from 'generated/prisma';
import { InputCreateVenueDto } from 'src/application/dtos/venues/create-venue.dto';
import { EventEntity } from 'src/domain/entities/event.entity';
import { QueryOptions } from 'src/application/dtos/shared/query-options.dto';
import { PrismaVenueMapper } from 'src/infrastructure/mappers/prisma.venue.mapper';
import { PrismaEventMapper } from 'src/infrastructure/mappers/prisma.event.mapper';
import { boundingBox } from 'src/domain/shared/utils/bounding-box';
import { InputUpdateVenueDto } from 'src/application/dtos/venues/update-venue.dto';

export type VenueEntityRelations = keyof Prisma.VenueInclude;
export type VenueQueryOptions = QueryOptions<VenueEntity>;

export class PrismaVenueRepository
    extends PrismaService<VenueEntity, Prisma.VenueFindManyArgs>
    implements VenueRepository
{
    async findAll(queryOptions?: VenueQueryOptions): Promise<VenueEntity[]> {
        const _venues = await this.venue.findMany(
            this.buildQuery(queryOptions),
        );

        return _venues.map(PrismaVenueMapper.toEntity);
    }

    async findOne(options?: VenueQueryOptions): Promise<VenueEntity | null> {
        const _venue = await this.venue.findFirst(this.buildQuery(options));
        return _venue ? PrismaVenueMapper.toEntity(_venue) : null;
    }

    async findById(id: number): Promise<VenueEntity | null> {
        const _venue = await this.venue.findUnique({ where: { id } });
        if (!_venue) return null;
        return PrismaVenueMapper.toEntity(_venue);
    }

    async findByLocation(
        location: { lat: number; lng: number; radius?: number },
        options?: VenueQueryOptions,
    ): Promise<VenueEntity[]> {
        if (options?.where) {
            delete options.where.lat; // Cannot override
            delete options.where.lng;
        }

        const { min_lat, max_lat, min_lng, max_lng } = boundingBox(
            location.lat,
            location.lng,
            location.radius ?? 1, // 1 km radius by default
        );

        const _venues = await this.venue.findMany(
            this.buildQuery({
                ...options,
                where: {
                    lat: {
                        operator: 'between',
                        value: [min_lat, max_lat],
                    },
                    lng: {
                        operator: 'between',
                        value: [min_lng, max_lng],
                    },
                    ...options?.where,
                },
            }),
        );

        return _venues.map(PrismaVenueMapper.toEntity);
    }

    async create(
        venue: InputCreateVenueDto & { organizer_id: number | bigint },
    ): Promise<VenueEntity> {
        const _venue = await this.venue.create({
            data: {
                name: venue.name,
                address: venue.address,
                city: venue.city,
                lat: venue.lat,
                lng: venue.lng,
                description: venue.description,
                phone: venue.phone,
                website: venue.website,
                image_url: venue.image_url,
                organizer_id: venue.organizer_id,
            },
        });

        return PrismaVenueMapper.toEntity(_venue);
    }

    async updateById(
        id: number | bigint,
        data: InputUpdateVenueDto,
    ): Promise<VenueEntity> {
        const _venue = await this.venue.update({
            where: { id },
            data,
        });

        return PrismaVenueMapper.toEntity(_venue);
    }

    async deleteById(id: number | bigint): Promise<void> {
        await this.venue.delete({ where: { id } });
        return;
    }

    async getEvents(venue_id: number): Promise<EventEntity[]> {
        const _events = await this.event.findMany({
            where: {
                venue_id: venue_id,
            },
        });

        return _events.map(PrismaEventMapper.toEntity);
    }
}
