import { Inject, Injectable, BadRequestException } from '@nestjs/common';
import { I18nService } from 'nestjs-i18n';
import {
    USER_INTEREST_EVENT_REPO_TOKEN,
    UserInterestEventRepository,
} from 'src/domain/repositories/user-interest-event.repository';
import { I18nTranslations } from 'src/i18n/generated/i18n.generated';
import { RemoveInterestResultDto } from 'src/application/dtos/user/interests/shared/remove-interest-result.dto';

@Injectable()
export class RemoveInterestEvents {
    constructor(
        @Inject(USER_INTEREST_EVENT_REPO_TOKEN)
        private readonly repo: UserInterestEventRepository,
        private readonly translator: I18nService<I18nTranslations>,
    ) {}

    async execute(
        userId: number | bigint,
        eventIds: number[],
    ): Promise<RemoveInterestResultDto> {
        if (!Array.isArray(eventIds) || eventIds.length === 0) {
            throw new BadRequestException(
                this.translator.t('users.errors.interests.events.not_provided'),
            );
        }

        // Validar qué IDs de events existen en la BBDD
        const existingIds = await this.repo.validateExistingEventIds(eventIds);
        const existingIdsNumbers = existingIds.map((id) => Number(id));
        const notFoundIds = eventIds.filter(
            (id) => !existingIdsNumbers.includes(id),
        );

        // Solo eliminar los que existen
        if (existingIdsNumbers.length > 0) {
            await this.repo.removeInterestEvents(userId, existingIdsNumbers);
        }

        return {
            removed: existingIdsNumbers,
            notFound: notFoundIds,
        };
    }
}
