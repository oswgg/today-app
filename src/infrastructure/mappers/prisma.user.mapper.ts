import { UserEntity } from 'src/domain/entities/user.entity';
import { users } from 'src/../generated/prisma';
import { UserRole } from 'src/domain/types/user-role.enum';
import { OrganizerEntity } from 'src/domain/entities/organizer.entity';

export class PrismaUserMapper {
    static toEntity(data: users): UserEntity {
        return {
            id: data.id,
            email: data.email,
            name: data.name,
            role: data.role as UserRole,
            createdAt: new Date(data.created_at),
            uid: data.uid,
        };
    }

    static toOrganizerEntity(data: users): OrganizerEntity {
        return {
            id: data.id,
            email: data.email,
            name: data.name,
            role: UserRole.ORGANIZER,
            createdAt: new Date(data.created_at),
            uid: data.uid,
        };
    }
}
