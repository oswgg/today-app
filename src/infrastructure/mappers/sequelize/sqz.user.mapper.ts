import { OrganizerEntity, UserEntity } from 'src/domain/entities/users';
import { UserRole } from 'src/domain/types/user-role.enum';
import { UserModel } from 'src/infrastructure/database/sequelize/models';

export class SQZUserMapper {
    static toEntity(model: UserModel): UserEntity {
        return {
            id: model.id,
            email: model.email,
            name: model.name,
            role: model.role,
            createdAt: model.createdAt,
            uid: model.uid,
        };
    }

    static toOrganizerEntity(model: UserModel): OrganizerEntity {
        return {
            id: model.id,
            email: model.email,
            name: model.name,
            role: UserRole.ORGANIZER,
            createdAt: model.createdAt,
            uid: model.uid,
        };
    }
}
