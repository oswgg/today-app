import { UserRole } from 'src/domain/types/user-role.enum';

export interface RegisterWithOAuthDto {
    token: string;
    user_type: UserRole;
}
