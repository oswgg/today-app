import { Provider } from '@nestjs/common';
import { USER_REPO_TOKEN } from 'src/domain/repositories/user.repository';
import { PrismaUserRepository } from 'src/infrastructure/database/prisma.user.repo.impl';

export const UserRepoProviders: Provider[] = [
    {
        provide: USER_REPO_TOKEN,
        useClass: PrismaUserRepository,
    },
];
