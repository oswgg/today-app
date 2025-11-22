import { UserInterestCategoryEntity } from './users/interests/user-interest-category.entity';

export interface CategoryEntity {
    id: number | bigint;
    name: string;
    description: string | null;
    interestedUsers?: UserInterestCategoryEntity[];
}
