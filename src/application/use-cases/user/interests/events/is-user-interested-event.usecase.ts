import { Inject, Injectable } from '@nestjs/common';
import {
    USER_INTEREST_EVENT_REPO_TOKEN,
    UserInterestEventRepository,
} from 'src/domain/repositories/user-interest-event.repository';

@Injectable()
export class IsUserInterestedInEvent {
    constructor(
        @Inject(USER_INTEREST_EVENT_REPO_TOKEN)
        private readonly repo: UserInterestEventRepository,
    ) {}

    async execute(
        userId: number | bigint,
        eventId: number | bigint,
    ): Promise<boolean> {
        return this.repo.isUserInterestedInEvent(userId, eventId);
    }
}
