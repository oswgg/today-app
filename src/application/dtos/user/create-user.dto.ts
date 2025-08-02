import { UserRole } from 'generated/prisma';

export interface CreateUserDto {
    email: string;
    name: string;
    role: UserRole;
    uid?: string;
}
