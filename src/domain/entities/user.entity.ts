import { UserRole } from '../types/user-role.enum';

export interface UserEntity {
    id: number;
    email: string;
    name: string;
    role: UserRole.USER;
    createdAt: Date;
    uid: string;
}
