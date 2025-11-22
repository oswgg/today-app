import { Inject, Injectable } from '@nestjs/common';
import {
    USER_INTEREST_LOCATION_REPO_TOKEN,
    UserInterestLocationRepository,
} from 'src/domain/repositories/user-interest-location.repository';

@Injectable()
export class IsUserInterestedInLocation {
    constructor(
        @Inject(USER_INTEREST_LOCATION_REPO_TOKEN)
        private readonly repo: UserInterestLocationRepository,
    ) {}

    async execute(
        userId: number | bigint,
        locationId: number | bigint,
    ): Promise<boolean> {
        return this.repo.isUserInterestedInLocation(userId, locationId);
    }
}
