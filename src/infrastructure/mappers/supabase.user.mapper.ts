import { UserResponse } from '@supabase/supabase-js';
import { UserEntity } from 'src/domain/entities/user.entity';

export class SupabaseUserMapper {
    static toEntity(rows: any[]): UserEntity {
        return {
            id: rows[0].id,
            email: rows[0].email,
            name: rows[0].name,
            role: rows[0].role,
            createdAt: new Date(rows[0].created_at),
            uid: rows[0].uid,
        };
    }

    static fromOAuth(data: UserResponse['data']['user']): Partial<UserEntity> {
        if (!data) {
            throw new Error('Invalid OAuth user response');
        }

        return {
            email: data.email,
            name: data.user_metadata.name as string,
            createdAt: new Date(data.created_at),
            uid: data.id,
        };
    }
}
