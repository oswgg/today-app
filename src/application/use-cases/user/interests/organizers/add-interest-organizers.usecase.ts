import { Inject, Injectable, BadRequestException } from '@nestjs/common';
import { I18nService } from 'nestjs-i18n';
import {
    USER_INTEREST_ORGANIZER_REPO_TOKEN,
    UserInterestOrganizerRepository,
} from 'src/domain/repositories/user-interest-organizer.repository';
import { UserInterestOrganizerEntity } from 'src/domain/entities/users/interests/user-interest-organizer.entity';
import { I18nTranslations } from 'src/i18n/generated/i18n.generated';
import {
    USER_REPO_TOKEN,
    UserRepository,
} from 'src/domain/repositories/user.repository';
import { AddInterestResultDto } from 'src/application/dtos/user/interests/shared/add-interest-result.dto';

@Injectable()
export class AddInterestOrganizers {
    constructor(
        @Inject(USER_INTEREST_ORGANIZER_REPO_TOKEN)
        private readonly repo: UserInterestOrganizerRepository,
        @Inject(USER_REPO_TOKEN)
        private readonly userRepo: UserRepository,
        private readonly translator: I18nService<I18nTranslations>,
    ) {}

    async execute(
        userId: number | bigint,
        organizerIds: number[],
    ): Promise<AddInterestResultDto<UserInterestOrganizerEntity>> {
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

        // Solo agregar los que existen
        let addedEntities: UserInterestOrganizerEntity[] = [];
        if (existingIdsNumbers.length > 0) {
            addedEntities = await this.repo.addInterestOrganizers(
                userId,
                existingIdsNumbers,
            );
        }

        return {
            added: addedEntities,
            notFound: notFoundIds,
        };
    }
}
