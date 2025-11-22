import { UserInterestEventEntity } from '../entities/users/interests/user-interest-event.entity';
import { EventEntity } from '../entities/event.entity';

export abstract class UserInterestEventRepository {
    abstract validateExistingEventIds(
        eventIds: (number | bigint)[],
    ): Promise<(number | bigint)[]>;

    abstract addInterestEvents(
        userId: number | bigint,
        eventIds: (number | bigint)[],
    ): Promise<UserInterestEventEntity[]>;

    abstract removeInterestEvents(
        userId: number | bigint,
        eventIds: (number | bigint)[],
    ): Promise<number>;

    abstract getUserInterestEvents(
        userId: number | bigint,
    ): Promise<EventEntity[]>;

    abstract isUserInterestedInEvent(
        userId: number | bigint,
        eventId: number | bigint,
    ): Promise<boolean>;
}

export const USER_INTEREST_EVENT_REPO_TOKEN = Symbol(
    'user-interest-event.repository',
);
