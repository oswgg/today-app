import { InputCreateLocationDto } from 'src/application/dtos/locations/create-location.dto';
import { LocationEntity } from '../entities/location.entity';
import { EventEntity } from '../entities/event.entity';
import { LocationQueryOptions } from 'src/infrastructure/database/prisma/prisma.location.repository.impl';
import { InputUpdateLocationDto } from 'src/application/dtos/locations/update-location.dto';

export interface LocationRepository {
    findById(id: number): Promise<LocationEntity | null>;
    findByLocation(
        location: { lat: number; lng: number; radius?: number },
        options?: LocationQueryOptions,
    ): Promise<LocationEntity[]>;
    findOne(options?: LocationQueryOptions): Promise<LocationEntity | null>;
    findAll(options?: LocationQueryOptions): Promise<LocationEntity[]>;
    create(
        location: InputCreateLocationDto & { creator_id: number | bigint },
    ): Promise<LocationEntity>;
    updateById(
        id: number | bigint,
        data: InputUpdateLocationDto,
    ): Promise<LocationEntity>;
    deleteById(id: number | bigint): Promise<void>;
    getEvents(location_id: number): Promise<EventEntity[]>;
}

export const LOCATION_REPO_TOKEN = Symbol('location.repository');
