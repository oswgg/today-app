import { UserEntity } from 'src/domain/entities/user.entity';
import { UserRepository } from 'src/domain/repositories/user.repository';
import {
    SupabaseUserMapper,
    SupabaseUserRow,
} from '../mappers/supabase.user.mapper';
import { SupabaseService } from './supabase.service';
import { CreateUserDto } from 'src/domain/dto/create-user.dto';

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
            return null;
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
}
