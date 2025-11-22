import { UserInterestLocationEntity } from '../entities/users/interests/user-interest-location.entity';
import { LocationEntity } from '../entities/location.entity';

export abstract class UserInterestLocationRepository {
    abstract validateExistingLocationIds(
        locationIds: (number | bigint)[],
    ): Promise<(number | bigint)[]>;

    abstract addInterestLocations(
        userId: number | bigint,
        locationIds: (number | bigint)[],
    ): Promise<UserInterestLocationEntity[]>;

    abstract removeInterestLocations(
        userId: number | bigint,
        locationIds: (number | bigint)[],
    ): Promise<number>;

    abstract getUserInterestLocations(
        userId: number | bigint,
    ): Promise<LocationEntity[]>;

    abstract isUserInterestedInLocation(
        userId: number | bigint,
        locationId: number | bigint,
    ): Promise<boolean>;
}

export const USER_INTEREST_LOCATION_REPO_TOKEN = Symbol(
    'user-interest-location.repository',
);
