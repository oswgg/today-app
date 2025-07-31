import { UserResponse } from '@supabase/supabase-js';
import { UserEntity } from 'src/domain/entities/user.entity';
import { UserFromOAuth } from 'src/domain/services/auth.service';
import { UserRole } from 'src/domain/types/user-role.enum';

export type SupabaseUserRow = {
    id: number | bigint;
    email: string;
    name: string;
    role: string;
    created_at: string | Date;
    uid: string | null;
};

export class SupabaseUserMapper {
    static toEntity(rows: SupabaseUserRow[]): UserEntity {
        return {
            id: rows[0].id,
            email: rows[0].email,
            name: rows[0].name,
            role: rows[0].role as UserRole,
            createdAt: new Date(rows[0].created_at),
            uid: rows[0].uid,
        };
    }

    static fromOAuth(data: UserResponse['data']['user']): UserFromOAuth {
        if (!data) {
            throw new Error('Invalid OAuth user response');
        }

        return {
            email: data.email!,
            name: data.user_metadata.name as string,
            uid: data.id,
        };
    }
}
