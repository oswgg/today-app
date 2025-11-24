import { Module, Provider } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { UserRepoProviders } from '../shared/providers/user.providers';
import { AuthServiceProviders, AuthUseCaseProviders } from './auth.providers';
import { PrismaService } from 'src/infrastructure/database/prisma/prisma.service';
import { SupabaseService } from 'src/infrastructure/database/supabase.service';

export const AuthModuleProviders: Provider[] = [
    PrismaService,
    SupabaseService,
    ...UserRepoProviders,
    ...AuthServiceProviders,
    ...AuthUseCaseProviders,
];

@Module({
    providers: AuthModuleProviders,
    controllers: [AuthController],
    exports: [...AuthUseCaseProviders, SupabaseService],
})
export class AuthModule {}
