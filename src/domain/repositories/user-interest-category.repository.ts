import { UserInterestCategoryEntity } from '../entities/users/interests/user-interest-category.entity';
import { CategoryEntity } from '../entities/category.entity';

export abstract class UserInterestCategoryRepository {
    abstract validateExistingCategoryIds(
        categoryIds: (number | bigint)[],
    ): Promise<(number | bigint)[]>;

    abstract addInterestCategories(
        userId: number | bigint,
        categoryIds: (number | bigint)[],
    ): Promise<UserInterestCategoryEntity[]>;

    abstract removeInterestCategories(
        userId: number | bigint,
        categoryIds: (number | bigint)[],
    ): Promise<number>;

    abstract getUserInterestCategories(
        userId: number | bigint,
    ): Promise<CategoryEntity[]>;

    abstract isUserInterestedInCategory(
        userId: number | bigint,
        categoryId: number | bigint,
    ): Promise<boolean>;
}

export const USER_INTEREST_CATEGORY_REPO_TOKEN = Symbol(
    'user-interest-category.repository',
);
