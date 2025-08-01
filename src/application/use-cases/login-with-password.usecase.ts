import { Inject, UnauthorizedException } from '@nestjs/common';
import { LoginWithPasswordDto } from 'src/domain/dto/login-with-password.dto';
import {
    USER_REPO_TOKEN,
    UserRepository,
} from 'src/domain/repositories/user.repository';
import {
    AUTH_SERVICE_TOKEN,
    AuthService,
} from 'src/domain/services/auth.service';

export class LoginWithPassword {
    constructor(
        @Inject(AUTH_SERVICE_TOKEN)
        private readonly authService: AuthService,
        @Inject(USER_REPO_TOKEN)
        private readonly userRepo: UserRepository,
    ) {}

    async execute(dto: LoginWithPasswordDto) {
        const { email, password } = dto;

        const user = await this.userRepo.findByEmail(email);
        if (!user) {
            throw new UnauthorizedException('Invalid email or password');
        }

        const loginResult = await this.authService.loginWithPassword(
            email,
            password,
            {
                user_id: user.id,
                role: user.role,
            },
        );

        return loginResult;
    }
}
