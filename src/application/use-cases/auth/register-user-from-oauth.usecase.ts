import { ForbiddenException, Inject } from '@nestjs/common';
import {
    AUTH_SERVICE_TOKEN,
    AuthService,
} from 'src/domain/services/auth.service';
import {
    USER_REPO_TOKEN,
    UserRepository,
} from 'src/domain/repositories/user.repository';
import { UserEntity } from 'src/domain/entities/user.entity';
import { I18nTranslations } from 'src/i18n/generated/i18n.generated';
import { I18nService } from 'nestjs-i18n';

export class RegisterUserFromOAuth {
    constructor(
        @Inject(AUTH_SERVICE_TOKEN)
        private readonly authService: AuthService,
        @Inject(USER_REPO_TOKEN)
        private readonly userRepository: UserRepository,
        private readonly translator: I18nService<I18nTranslations>,
    ) {}

    async execute(token: string): Promise<UserEntity> {
        const userData = await this.authService.getUserFromOAuthToken(token);

        const existingUser = await this.userRepository.findByEmail(
            userData.email,
        );
        if (existingUser) {
            throw new ForbiddenException(
                this.translator.t('users.errors.email_already_exists'),
            );
        }

        const user = await this.userRepository.registerUserFromOAuth(userData);

        return user;
    }
}
