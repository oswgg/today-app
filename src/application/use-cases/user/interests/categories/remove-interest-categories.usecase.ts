import { Inject, Injectable, BadRequestException } from '@nestjs/common';
import { I18nService } from 'nestjs-i18n';
import {
    USER_INTEREST_CATEGORY_REPO_TOKEN,
    UserInterestCategoryRepository,
} from 'src/domain/repositories/user-interest-category.repository';
import { I18nTranslations } from 'src/i18n/generated/i18n.generated';
import { RemoveInterestResultDto } from 'src/application/dtos/user/interests/shared/remove-interest-result.dto';

@Injectable()
export class RemoveInterestCategories {
    constructor(
        @Inject(USER_INTEREST_CATEGORY_REPO_TOKEN)
        private readonly repo: UserInterestCategoryRepository,
        private readonly translator: I18nService<I18nTranslations>,
    ) {}

    async execute(
        userId: number | bigint,
        categoryIds: number[],
    ): Promise<RemoveInterestResultDto> {
        if (!Array.isArray(categoryIds) || categoryIds.length === 0) {
            throw new BadRequestException(
                this.translator.t(
                    'users.errors.interests.categories.not_provided',
                ),
            );
        }

        // Validar qué IDs de categories existen en la BBDD
        const existingIds =
            await this.repo.validateExistingCategoryIds(categoryIds);
        const existingIdsNumbers = existingIds.map((id) => Number(id));
        const notFoundIds = categoryIds.filter(
            (id) => !existingIdsNumbers.includes(id),
        );

        // Solo eliminar los que existen
        if (existingIdsNumbers.length > 0) {
            await this.repo.removeInterestCategories(
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
