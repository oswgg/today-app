import { UserRole } from '../../types/user-role.enum';
import { UserInterestCategoryEntity } from './interests/user-interest-category.entity';

export class UserEntity {
    id: number | bigint;
    email: string;
    name: string;
    role: UserRole;
    createdAt: Date;
    uid: string | null;
    mfaEnabled: boolean;
    mfaFactorId: string | null;
    mfaRequired: boolean;
    interestCategories?: UserInterestCategoryEntity[];
}
