import { UserRole } from '../types/user-role.enum';

export interface OrganizerEntity {
    id: number;
    name: string;
    email: string;
    role: UserRole.ORGANIZER;
    createdAt: Date;
    uid: string;
}
