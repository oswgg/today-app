import { UserEntity, OrganizerEntity } from 'src/domain/entities/users';
import { User } from 'src/../generated/prisma';
import { UserRole } from 'src/domain/types/user-role.enum';

export class PrismaUserMapper {
    static toEntity(data: User): UserEntity {
        return {
            id: data.id,
            email: data.email,
            name: data.name,
            role: data.role as UserRole,
            createdAt: new Date(data.created_at),
            uid: data.uid,
            mfaEnabled: false,
            mfaFactorId: null,
            mfaRequired: false,
        };
    }

    static toOrganizerEntity(data: User): OrganizerEntity {
        return {
            id: data.id,
            email: data.email,
            name: data.name,
            role: UserRole.ORGANIZER,
            createdAt: new Date(data.created_at),
            uid: data.uid,
            mfaEnabled: false,
            mfaFactorId: null,
            mfaRequired: false,
        };
    }
}
