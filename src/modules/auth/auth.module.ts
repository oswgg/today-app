import { Module, Provider } from '@nestjs/common';
import { PrismaService } from 'src/infrastructure/database/prisma.service';
import { AuthController } from './auth.controller';
import { UserRepoProviders } from '../shared/providers/user.providers';
import { AuthServiceProviders, AuthUseCaseProviders } from './auth.providers';

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
