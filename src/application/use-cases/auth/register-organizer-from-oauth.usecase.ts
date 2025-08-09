import { ForbiddenException, Inject } from '@nestjs/common';
import { OrganizerEntity } from 'src/domain/entities/organizer.entity';
import {
    USER_REPO_TOKEN,
    UserRepository,
} from 'src/domain/repositories/user.repository';
import {
    AUTH_SERVICE_TOKEN,
    AuthService,
} from 'src/domain/services/auth.service';
import { I18nService } from 'nestjs-i18n';
import { I18nTranslations } from 'src/i18n/generated/i18n.generated';
export class RegisterOrganizerFromOAuth {
    constructor(
        @Inject(AUTH_SERVICE_TOKEN)
        private readonly authService: AuthService,
        @Inject(USER_REPO_TOKEN)
        private readonly userRepository: UserRepository,
        private readonly translator: I18nService<I18nTranslations>,
    ) {}

    async execute(token: string): Promise<OrganizerEntity> {
        const user = await this.authService.getUserFromOAuthToken(token);

        const existingUser = await this.userRepository.findByEmail(user.email);
        if (existingUser) {
            throw new ForbiddenException(
                this.translator.t('users.errors.email_already_exists'),
            );
        }

        const organizer =
            await this.userRepository.registerOrganizerFromOAuth(user);

        return organizer;
    }
}
