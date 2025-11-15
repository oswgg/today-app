import { Inject, Injectable } from '@nestjs/common';
import { LocationEntity } from 'src/domain/entities/location.entity';
import {
    LOCATION_REPO_TOKEN,
    LocationRepository,
} from 'src/domain/repositories/location.repository';

export interface ListLocationsFilters {
    creator_id?: number | bigint;
}

@Injectable()
export class ListLocations {
    constructor(
        @Inject(LOCATION_REPO_TOKEN)
        private locationRepository: LocationRepository,
    ) {}

    async execute(filters?: ListLocationsFilters): Promise<LocationEntity[]> {
        const whereClause: any = {};

        if (filters?.creator_id) {
            whereClause.creator_id = {
                operator: 'eq',
                value: filters.creator_id,
            };
        }

        return await this.locationRepository.findAll({
            where:
                Object.keys(whereClause).length > 0 ? whereClause : undefined,
            include: [
                {
                    model: 'creator',
                },
                {
                    model: 'events',
                },
            ],
        });
    }
}
