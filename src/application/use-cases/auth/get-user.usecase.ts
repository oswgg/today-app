import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { I18nService } from 'nestjs-i18n';
import { UserEntity } from 'src/domain/entities/users';
import {
    USER_REPO_TOKEN,
    UserRepository,
} from 'src/domain/repositories/user.repository';
import { I18nTranslations } from 'src/i18n/generated/i18n.generated';

@Injectable()
export class GetUser {
    constructor(
        @Inject(USER_REPO_TOKEN) private readonly userRepo: UserRepository,
        private readonly translator: I18nService<I18nTranslations>,
    ) {}

    async execute(id: number): Promise<UserEntity> {
        const user = await this.userRepo.findById(id);
        if (!user) {
            throw new NotFoundException(
                this.translator.t('users.errors.not_found'),
            );
        }

        return user;
    }
}
