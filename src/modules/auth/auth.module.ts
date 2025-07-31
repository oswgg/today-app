import { Module, Provider } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { UserRepoProviders } from '../shared/providers/user.providers';
import { AuthServiceProviders, AuthUseCaseProviders } from './auth.providers';
import { PrismaService } from 'src/infrastructure/database/prisma.service';

export const AuthModuleProviders: Provider[] = [
    PrismaService,
    ...UserRepoProviders,
    ...AuthServiceProviders,
    ...AuthUseCaseProviders,
];

@Module({
    providers: AuthModuleProviders,
    controllers: [AuthController],
})
export class AuthModule {}
