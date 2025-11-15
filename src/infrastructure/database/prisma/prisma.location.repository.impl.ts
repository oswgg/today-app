import { LocationRepository } from 'src/domain/repositories/location.repository';
import { PrismaService } from './prisma.service';
import { LocationEntity } from 'src/domain/entities/location.entity';
import { Prisma } from 'generated/prisma';
import { InputCreateLocationDto } from 'src/application/dtos/locations/create-location.dto';
import { EventEntity } from 'src/domain/entities/event.entity';
import { QueryOptions } from 'src/application/dtos/shared/query-options.dto';
import { PrismaLocationMapper } from 'src/infrastructure/mappers/prisma.location.mapper';
import { PrismaEventMapper } from 'src/infrastructure/mappers/prisma.event.mapper';
import { boundingBox } from 'src/domain/shared/utils/bounding-box';
import { InputUpdateLocationDto } from 'src/application/dtos/locations/update-location.dto';

export type LocationEntityRelations = keyof Prisma.LocationInclude;
export type LocationQueryOptions = QueryOptions<LocationEntity>;

export class PrismaLocationRepository
    extends PrismaService<LocationEntity, Prisma.LocationFindManyArgs>
    implements LocationRepository
{
    async findAll(
        queryOptions?: LocationQueryOptions,
    ): Promise<LocationEntity[]> {
        const _locations = await this.location.findMany(
            this.buildQuery(queryOptions),
        );

        return _locations.map(PrismaLocationMapper.toEntity);
    }

    async findOne(
        options?: LocationQueryOptions,
    ): Promise<LocationEntity | null> {
        const _location = await this.location.findFirst(
            this.buildQuery(options),
        );
        return _location ? PrismaLocationMapper.toEntity(_location) : null;
    }

    async findById(id: number): Promise<LocationEntity | null> {
        const _location = await this.location.findUnique({ where: { id } });
        if (!_location) return null;
        return PrismaLocationMapper.toEntity(_location);
    }

    async findByLocation(
        location: { lat: number; lng: number; radius?: number },
        options?: LocationQueryOptions,
    ): Promise<LocationEntity[]> {
        if (options?.where) {
            delete options.where.lat; // Cannot override
            delete options.where.lng;
        }

        const { min_lat, max_lat, min_lng, max_lng } = boundingBox(
            location.lat,
            location.lng,
            location.radius ?? 1, // 1 km radius by default
        );

        const _locations = await this.location.findMany(
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

        return _locations.map(PrismaLocationMapper.toEntity);
    }

    async create(
        location: InputCreateLocationDto & { creator_id: number | bigint },
    ): Promise<LocationEntity> {
        const _location = await this.location.create({
            data: location,
        });

        return PrismaLocationMapper.toEntity(_location);
    }

    async updateById(
        id: number | bigint,
        data: InputUpdateLocationDto,
    ): Promise<LocationEntity> {
        console.log(data);
        const _location = await this.location.update({
            where: { id },
            data,
        });

        return PrismaLocationMapper.toEntity(_location);
    }

    async deleteById(id: number | bigint): Promise<void> {
        await this.location.delete({ where: { id } });
        return;
    }

    async getEvents(location_id: number): Promise<EventEntity[]> {
        const _events = await this.event.findMany({
            where: {
                location_id: location_id,
            },
        });

        return _events.map(PrismaEventMapper.toEntity);
    }
}
