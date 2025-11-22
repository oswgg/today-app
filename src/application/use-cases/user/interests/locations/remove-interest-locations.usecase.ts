import { Inject, Injectable, BadRequestException } from '@nestjs/common';
import { I18nService } from 'nestjs-i18n';
import {
    USER_INTEREST_LOCATION_REPO_TOKEN,
    UserInterestLocationRepository,
} from 'src/domain/repositories/user-interest-location.repository';
import { I18nTranslations } from 'src/i18n/generated/i18n.generated';
import { RemoveInterestResultDto } from 'src/application/dtos/user/interests/shared/remove-interest-result.dto';

@Injectable()
export class RemoveInterestLocations {
    constructor(
        @Inject(USER_INTEREST_LOCATION_REPO_TOKEN)
        private readonly repo: UserInterestLocationRepository,
        private readonly translator: I18nService<I18nTranslations>,
    ) {}

    async execute(
        userId: number | bigint,
        locationIds: number[],
    ): Promise<RemoveInterestResultDto> {
        if (!Array.isArray(locationIds) || locationIds.length === 0) {
            throw new BadRequestException(
                this.translator.t(
                    'users.errors.interests.locations.not_provided',
                ),
            );
        }

        // Validar qué IDs de locations existen en la BBDD
        const existingIds =
            await this.repo.validateExistingLocationIds(locationIds);
        const existingIdsNumbers = existingIds.map((id) => Number(id));
        const notFoundIds = locationIds.filter(
            (id) => !existingIdsNumbers.includes(id),
        );

        // Solo eliminar los que existen
        if (existingIdsNumbers.length > 0) {
            await this.repo.removeInterestLocations(userId, existingIdsNumbers);
        }

        return {
            removed: existingIdsNumbers,
            notFound: notFoundIds,
        };
    }
}
