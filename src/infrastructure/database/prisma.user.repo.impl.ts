import { Injectable } from '@nestjs/common';
import { UserRepository } from 'src/domain/repositories/user.repository';
import { PrismaService } from './prisma.service';
import { UserEntity } from 'src/domain/entities/user.entity';
import { PrismaUserMapper } from 'src/infrastructure/mappers/prisma.user.mapper';
import { CreateUserDto } from 'src/domain/dto/create-user.dto';
import { OrganizerEntity } from 'src/domain/entities/organizer.entity';
import { UserFromOAuth } from 'src/domain/services/auth.service';
import { UserRole } from 'src/domain/types/user-role.enum';

@Injectable()
export class PrismaUserRepository extends UserRepository {
    constructor(private readonly prisma: PrismaService) {
        super();
    }

    async findById(id: number): Promise<UserEntity | null> {
        const user = await this.prisma.users.findUnique({ where: { id } });
        return user ? PrismaUserMapper.toEntity(user) : null;
    }

    async findByEmail(email: string): Promise<UserEntity | null> {
        const user = await this.prisma.users.findUnique({ where: { email } });
        return user ? PrismaUserMapper.toEntity(user) : null;
    }

    async create(data: CreateUserDto): Promise<UserEntity> {
        const user = await this.prisma.users.create({
            data,
        });
        return PrismaUserMapper.toEntity(user);
    }

    async registerOrganizerFromOAuth(
        data: UserFromOAuth,
    ): Promise<OrganizerEntity> {
        const user = await this.prisma.users.create({
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
        const user = await this.prisma.users.create({
            data: {
                email: data.email,
                name: data.name,
                role: UserRole.USER,
                uid: data.uid,
            },
        });

        return PrismaUserMapper.toEntity(user);
    }
}
