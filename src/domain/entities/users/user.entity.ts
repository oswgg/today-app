import { UserRole } from '../../types/user-role.enum';

export class UserEntity {
    id: number | bigint;
    email: string;
    name: string;
    role: UserRole;
    createdAt: Date;
    uid: string | null;
}
