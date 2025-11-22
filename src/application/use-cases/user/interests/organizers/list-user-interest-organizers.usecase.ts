import { Inject, Injectable } from '@nestjs/common';
import {
    USER_INTEREST_ORGANIZER_REPO_TOKEN,
    UserInterestOrganizerRepository,
} from 'src/domain/repositories/user-interest-organizer.repository';

@Injectable()
export class ListUserInterestOrganizers {
    constructor(
        @Inject(USER_INTEREST_ORGANIZER_REPO_TOKEN)
        private readonly repo: UserInterestOrganizerRepository,
    ) {}

    async execute(userId: number | bigint): Promise<any[]> {
        return this.repo.getUserInterestOrganizers(userId);
    }
}
