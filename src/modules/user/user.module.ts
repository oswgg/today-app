import { Module } from '@nestjs/common';
import { GetUser } from 'src/application/use-cases/auth/get-user.usecase';
import { USER_REPO_TOKEN } from 'src/domain/repositories/user.repository';
import { PrismaService } from 'src/infrastructure/database/prisma.service';
import { PrismaUserRepository } from 'src/infrastructure/database/prisma.user.repo.impl';
import { UserController } from './user.controller';

@Module({
    providers: [
        PrismaService,
        {
            provide: USER_REPO_TOKEN,
            useClass: PrismaUserRepository,
        },
        GetUser,
    ],
    controllers: [UserController],
})
export class UserModule {}
