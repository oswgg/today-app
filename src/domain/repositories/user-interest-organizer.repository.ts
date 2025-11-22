import { UserInterestOrganizerEntity } from '../entities/users/interests/user-interest-organizer.entity';

export abstract class UserInterestOrganizerRepository {
    abstract validateExistingOrganizerIds(
        organizerIds: (number | bigint)[],
    ): Promise<(number | bigint)[]>;

    abstract addInterestOrganizers(
        userId: number | bigint,
        organizerIds: (number | bigint)[],
    ): Promise<UserInterestOrganizerEntity[]>;

    abstract removeInterestOrganizers(
        userId: number | bigint,
        organizerIds: (number | bigint)[],
    ): Promise<number>;

    abstract getUserInterestOrganizers(userId: number | bigint): Promise<any[]>; // OrganizerProfileEntity cuando esté definido

    abstract isUserInterestedInOrganizer(
        userId: number | bigint,
        organizerId: number | bigint,
    ): Promise<boolean>;
}

export const USER_INTEREST_ORGANIZER_REPO_TOKEN = Symbol(
    'user-interest-organizer.repository',
);
