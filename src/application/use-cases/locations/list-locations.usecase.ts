import { Inject, Injectable } from '@nestjs/common';
import { LocationEntity } from 'src/domain/entities/location.entity';
import {
    LOCATION_REPO_TOKEN,
    LocationRepository,
} from 'src/domain/repositories/location.repository';

@Injectable()
export class ListLocations {
    constructor(
        @Inject(LOCATION_REPO_TOKEN) private locationRepository: LocationRepository,
    ) {}

    async execute(): Promise<LocationEntity[]> {
        return await this.locationRepository.findAll({
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
