import { Inject, Injectable } from '@nestjs/common';
import {
    USER_INTEREST_EVENT_REPO_TOKEN,
    UserInterestEventRepository,
} from 'src/domain/repositories/user-interest-event.repository';
import { EventEntity } from 'src/domain/entities/event.entity';

@Injectable()
export class ListUserInterestEvents {
    constructor(
        @Inject(USER_INTEREST_EVENT_REPO_TOKEN)
        private readonly repo: UserInterestEventRepository,
    ) {}

    async execute(userId: number | bigint): Promise<EventEntity[]> {
        return this.repo.getUserInterestEvents(userId);
    }
}
