import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import {
    USER_REPO_TOKEN,
    UserRepository,
} from 'src/domain/repositories/user.repository';
import {
    AUTH_SERVICE_TOKEN,
    AuthService,
    LoginResult,
} from 'src/domain/services/auth.service';

@Injectable()
export class LoginWithOAuth {
    constructor(
        @Inject(AUTH_SERVICE_TOKEN)
        private readonly authService: AuthService,
        @Inject(USER_REPO_TOKEN)
        private readonly userRepo: UserRepository,
    ) {}

    async execute(token: string): Promise<LoginResult> {
        const userData = await this.authService.getUserFromOAuthToken(token);
        const user = await this.userRepo.findByEmail(userData.email);

        if (!user) {
            throw new UnauthorizedException(
                'User not found. Please register first',
            );
        }

        const authResult = await this.authService.loginWithOAuth(token, {
            role: user.role,
            user_id: user.id,
        });

        return authResult;
    }
}
