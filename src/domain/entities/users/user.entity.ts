import { UserRole } from '../../types/user-role.enum';
import { UserInterestCategoryEntity } from '../user-interest-category.entity';

export class UserEntity {
    id: number | bigint;
    email: string;
    name: string;
    role: UserRole;
    createdAt: Date;
    uid: string | null;
    interestCategories?: UserInterestCategoryEntity[];
}
