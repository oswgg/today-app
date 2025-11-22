import { Inject, Injectable } from '@nestjs/common';
import {
    USER_INTEREST_LOCATION_REPO_TOKEN,
    UserInterestLocationRepository,
} from 'src/domain/repositories/user-interest-location.repository';
import { LocationEntity } from 'src/domain/entities/location.entity';

@Injectable()
export class ListUserInterestLocations {
    constructor(
        @Inject(USER_INTEREST_LOCATION_REPO_TOKEN)
        private readonly repo: UserInterestLocationRepository,
    ) {}

    async execute(userId: number | bigint): Promise<LocationEntity[]> {
        return this.repo.getUserInterestLocations(userId);
    }
}
