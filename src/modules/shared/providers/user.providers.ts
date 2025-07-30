import { Provider } from '@nestjs/common';
import { USER_REPO_TOKEN } from 'src/domain/repositories/user.repository';
import { SupabaseUserRepository } from 'src/infrastructure/database/supabase.user.repo.impl';

export const UserRepoProviders: Provider[] = [
    {
        provide: USER_REPO_TOKEN,
        useClass: SupabaseUserRepository,
    },
];
