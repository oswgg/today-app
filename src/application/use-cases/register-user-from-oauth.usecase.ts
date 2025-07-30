import { Inject } from '@nestjs/common';
import {
    AUTH_SERVICE_TOKEN,
    AuthService,
} from 'src/domain/services/auth.service';
import {
    USER_REPO_TOKEN,
    UserRepository,
} from 'src/domain/repositories/user.repository';
import { UserEntity } from 'src/domain/entities/user.entity';
import { UserRole } from 'src/domain/types/user-role.enum';

export class RegisterUserFromOAuth {
    constructor(
        @Inject(AUTH_SERVICE_TOKEN)
        private readonly authService: AuthService,
        @Inject(USER_REPO_TOKEN)
        private readonly userRepository: UserRepository,
    ) {}

    async execute(token: string): Promise<UserEntity> {
        const userData = await this.authService.getUserFromOAuthToken(token);

        const existingUser = await this.userRepository.findByEmail(
            userData.email!,
        );
        if (existingUser) {
            throw new Error('User with the same email already exists');
        }

        const user = await this.userRepository.create({
            uid: userData.uid,
            email: userData.email,
            name: userData.name,
            role: UserRole.USER,
        });

        return user;
    }
}
