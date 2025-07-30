import { UserRole } from '../types/user-role.enum';

export interface CreateUserDto {
    email: string;
    name: string;
    role: UserRole;
    uid?: string;
}
