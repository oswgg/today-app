import { UserEntity, OrganizerEntity } from 'src/domain/entities/users';
import { UserRepository } from 'src/domain/repositories/user.repository';
import {
    SupabaseUserMapper,
    SupabaseUserRow,
} from '../mappers/supabase.user.mapper';
import { SupabaseService } from './supabase.service';
import { UserFromOAuth } from 'src/domain/services/auth.service';
import { CreateUserDto } from 'src/application/dtos/user/create-user.dto';

export class SupabaseUserRepository
    extends SupabaseService
    implements UserRepository
{
    async findById(id: number): Promise<UserEntity | null> {
        const { data, error } = await this.supabase
            .from('users')
            .select('*')
            .eq('id', id);

        if (error) {
            return null;
        }

        if (data.length === 0) {
            return null;
        }

        return SupabaseUserMapper.toEntity(data as SupabaseUserRow[]);
    }

    async findByEmail(email: string): Promise<UserEntity | null> {
        const { data, error } = await this.supabase
            .from('users')
            .select('*')
            .eq('email', email);

        if (error) {
            throw new Error('Failed to find user by email', { cause: error });
        }

        if (data.length === 0) {
            return null;
        }

        return SupabaseUserMapper.toEntity(data as SupabaseUserRow[]);
    }

    async create(data: CreateUserDto): Promise<UserEntity> {
        const { data: createdUser, error } = await this.supabase
            .from('users')
            .insert(data)
            .select('*');

        if (error) {
            throw new Error('Failed to create user');
        }

        return SupabaseUserMapper.toEntity(createdUser as SupabaseUserRow[]);
    }

    async registerOrganizerFromOAuth(
        data: UserFromOAuth,
    ): Promise<OrganizerEntity> {
        const { data: createdUser, error } = await this.supabase
            .from('users')
            .insert(data)
            .select('*');

        if (error) {
            throw new Error('Failed to create organizer');
        }

        const organizer = SupabaseUserMapper.toOrganizerEntity(
            createdUser as SupabaseUserRow[],
        );

        await this.supabase.auth.admin.updateUserById(organizer.uid!, {
            app_metadata: { role: organizer.role },
        });

        return organizer;
    }

    async registerUserFromOAuth(data: UserFromOAuth): Promise<UserEntity> {
        const { data: createdUser, error } = await this.supabase
            .from('users')
            .insert(data)
            .select('*');

        if (error) {
            throw new Error('Failed to create user');
        }

        const user = SupabaseUserMapper.toEntity(
            createdUser as SupabaseUserRow[],
        );

        await this.supabase.auth.admin.updateUserById(user.uid!, {
            app_metadata: { role: user.role },
        });

        return user;
    }
}
