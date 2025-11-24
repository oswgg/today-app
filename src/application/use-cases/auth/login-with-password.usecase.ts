import { Inject, UnauthorizedException } from '@nestjs/common';
import { I18nService } from 'nestjs-i18n';
import { LoginWithPasswordDto } from 'src/application/dtos/auth/login-with-password.dto';
import {
    USER_REPO_TOKEN,
    UserRepository,
} from 'src/domain/repositories/user.repository';
import {
    AUTH_SERVICE_TOKEN,
    AuthService,
} from 'src/domain/services/auth.service';
import { I18nTranslations } from 'src/i18n/generated/i18n.generated';

export class LoginWithPassword {
    constructor(
        @Inject(AUTH_SERVICE_TOKEN)
        private readonly authService: AuthService,
        @Inject(USER_REPO_TOKEN)
        private readonly userRepo: UserRepository,
        private readonly translator: I18nService<I18nTranslations>,
    ) {}

    async execute(dto: LoginWithPasswordDto) {
        const { email, password } = dto;

        const user = await this.userRepo.findByEmail(email);
        if (!user) {
            throw new UnauthorizedException(
                this.translator.t('auth.errors.invalid_credentials'),
            );
        }

        const loginResult = await this.authService.loginWithPassword(
            email,
            password,
            {
                user_id: user.id,
                user_email: user.email,
                user_name: user.name,
                user_role: user.role,
                supabase_token: '', // Will be filled by the auth service
            },
        );

        return loginResult;
    }
}
