import { Provider } from '@nestjs/common';
import { USER_REPO_TOKEN } from 'src/domain/repositories/user.repository';
import { SQZUserRepoImpl } from 'src/infrastructure/repositories/sqz.user.repo.impl';

export const UserRepoProviders: Provider[] = [
    {
        provide: USER_REPO_TOKEN,
        useClass: SQZUserRepoImpl,
    },
];
