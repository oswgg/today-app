import { Inject, Injectable } from '@nestjs/common';
import {
    USER_INTEREST_CATEGORY_REPO_TOKEN,
    UserInterestCategoryRepository,
} from 'src/domain/repositories/user-interest-category.repository';

@Injectable()
export class IsUserInterested {
    constructor(
        @Inject(USER_INTEREST_CATEGORY_REPO_TOKEN)
        private readonly repo: UserInterestCategoryRepository,
    ) {}

    async execute(
        userId: number | bigint,
        categoryId: number,
    ): Promise<boolean> {
        return this.repo.isUserInterestedInCategory(userId, categoryId);
    }
}
