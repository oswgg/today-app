import { Inject, Injectable } from '@nestjs/common';
import {
    USER_INTEREST_CATEGORY_REPO_TOKEN,
    UserInterestCategoryRepository,
} from 'src/domain/repositories/user-interest-category.repository';
import { CategoryEntity } from 'src/domain/entities/category.entity';

@Injectable()
export class ListUserInterestCategories {
    constructor(
        @Inject(USER_INTEREST_CATEGORY_REPO_TOKEN)
        private readonly repo: UserInterestCategoryRepository,
    ) {}

    async execute(userId: number | bigint): Promise<CategoryEntity[]> {
        return this.repo.getUserInterestCategories(userId);
    }
}
