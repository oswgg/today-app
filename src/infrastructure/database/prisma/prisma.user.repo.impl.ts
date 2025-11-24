import { Injectable } from '@nestjs/common';
import {
    UpdateMfaDto,
    UserRepository,
} from 'src/domain/repositories/user.repository';
import { PrismaService } from './prisma.service';
import { PrismaUserMapper } from 'src/infrastructure/mappers/prisma.user.mapper';
import { UserFromOAuth } from 'src/domain/services/auth.service';
import { UserRole } from 'src/domain/types/user-role.enum';
import { CreateUserDto } from 'src/application/dtos/user/create-user.dto';
import { Prisma } from 'generated/prisma';
import { QueryOptions } from 'src/application/dtos/shared/query-options.dto';
import { UserEntity } from 'src/domain/entities/users/user.entity';
import { OrganizerEntity } from 'src/domain/entities/users/organizer.entity';

export type UserQueryOptions = QueryOptions<UserEntity>;

@Injectable()
export class PrismaUserRepository
    extends PrismaService<UserEntity, Prisma.UserFindManyArgs>
    implements UserRepository
{
    async findById(id: number): Promise<UserEntity | null> {
        const user = await this.user.findUnique({ where: { id } });
        return user ? PrismaUserMapper.toEntity(user) : null;
    }

    async findByEmail(email: string): Promise<UserEntity | null> {
        const user = await this.user.findUnique({ where: { email } });
        return user ? PrismaUserMapper.toEntity(user) : null;
    }

    async create(data: CreateUserDto): Promise<UserEntity> {
        const user = await this.user.create({
            data,
        });
        return PrismaUserMapper.toEntity(user);
    }

    async registerOrganizerFromOAuth(
        data: UserFromOAuth,
    ): Promise<OrganizerEntity> {
        const user = await this.user.create({
            data: {
                email: data.email,
                name: data.name,
                role: UserRole.ORGANIZER,
                uid: data.uid,
            },
        });

        return PrismaUserMapper.toOrganizerEntity(user);
    }

    async registerUserFromOAuth(data: UserFromOAuth): Promise<UserEntity> {
        const user = await this.user.create({
            data: {
                email: data.email,
                name: data.name,
                role: UserRole.USER,
                uid: data.uid,
            },
        });

        return PrismaUserMapper.toEntity(user);
    }

    async updateMfaSettings(
        userId: number,
        data: UpdateMfaDto,
    ): Promise<UserEntity> {
        const user = await this.user.update({
            where: { id: userId },
            data,
        });
        return PrismaUserMapper.toEntity(user);
    }
}
