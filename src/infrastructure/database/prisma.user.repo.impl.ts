import { Injectable } from '@nestjs/common';
import { UserRepository } from 'src/domain/repositories/user.repository';
import { PrismaService } from './prisma.service';
import { UserEntity } from 'src/domain/entities/user.entity';
import { PrismaUserMapper } from 'src/infrastructure/mappers/prisma.user.mapper';
import { CreateUserDto } from 'src/domain/dto/create-user.dto';

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
}
