import { UserEntity } from 'src/domain/entities/user.entity';

export class PrismaUserMapper {
    static toEntity(data: any): UserEntity {
        return {
            id: data.id,
            email: data.email,
            name: data.name,
            role: data.role,
            createdAt: new Date(data.created_at),
            uid: data.uid,
        };
    }
}
