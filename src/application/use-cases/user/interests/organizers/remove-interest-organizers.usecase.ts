import { Inject, Injectable, BadRequestException } from '@nestjs/common';
import { I18nService } from 'nestjs-i18n';
import {
    USER_INTEREST_ORGANIZER_REPO_TOKEN,
    UserInterestOrganizerRepository,
} from 'src/domain/repositories/user-interest-organizer.repository';
import { I18nTranslations } from 'src/i18n/generated/i18n.generated';
import { RemoveInterestResultDto } from 'src/application/dtos/user/interests/shared/remove-interest-result.dto';

@Injectable()
export class RemoveInterestOrganizers {
    constructor(
        @Inject(USER_INTEREST_ORGANIZER_REPO_TOKEN)
        private readonly repo: UserInterestOrganizerRepository,
        private readonly translator: I18nService<I18nTranslations>,
    ) {}

    async execute(
        userId: number | bigint,
        organizerIds: number[],
    ): Promise<RemoveInterestResultDto> {
        if (!Array.isArray(organizerIds) || organizerIds.length === 0) {
            throw new BadRequestException(
                this.translator.t(
                    'users.errors.interests.organizers.not_provided',
                ),
            );
        }

        // Validar qué IDs de organizers existen en la BBDD
        const existingIds =
            await this.repo.validateExistingOrganizerIds(organizerIds);
        const existingIdsNumbers = existingIds.map((id) => Number(id));
        const notFoundIds = organizerIds.filter(
            (id) => !existingIdsNumbers.includes(id),
        );

        // Solo eliminar los que existen
        if (existingIdsNumbers.length > 0) {
            await this.repo.removeInterestOrganizers(
                userId,
                existingIdsNumbers,
            );
        }

        return {
            removed: existingIdsNumbers,
            notFound: notFoundIds,
        };
    }
}
