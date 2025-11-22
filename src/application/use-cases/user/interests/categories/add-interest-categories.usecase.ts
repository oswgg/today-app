import { Inject, Injectable, BadRequestException } from '@nestjs/common';
import { I18nService } from 'nestjs-i18n';
import {
    USER_INTEREST_CATEGORY_REPO_TOKEN,
    UserInterestCategoryRepository,
} from 'src/domain/repositories/user-interest-category.repository';
import { I18nTranslations } from 'src/i18n/generated/i18n.generated';
import { AddInterestResultDto } from 'src/application/dtos/user/interests/shared/add-interest-result.dto';
import { UserInterestCategoryEntity } from 'src/domain/entities/user-interest-category.entity';

@Injectable()
export class AddInterestCategories {
    constructor(
        @Inject(USER_INTEREST_CATEGORY_REPO_TOKEN)
        private readonly repo: UserInterestCategoryRepository,
        private readonly translator: I18nService<I18nTranslations>,
    ) {}

    async execute(
        userId: number | bigint,
        categoryIds: number[],
    ): Promise<AddInterestResultDto<UserInterestCategoryEntity>> {
        if (!Array.isArray(categoryIds) || categoryIds.length === 0) {
            throw new BadRequestException(
                this.translator.t(
                    'users.errors.interests.categories.not_provided',
                ),
            );
        }

        // Validar qué IDs de categorías existen en la BBDD
        const existingIds =
            await this.repo.validateExistingCategoryIds(categoryIds);
        const existingIdsNumbers = existingIds.map((id) => Number(id));
        const notFoundIds = categoryIds.filter(
            (id) => !existingIdsNumbers.includes(id),
        );

        // Solo agregar los que existen
        let addedEntities: UserInterestCategoryEntity[] = [];
        if (existingIdsNumbers.length > 0) {
            addedEntities = await this.repo.addInterestCategories(
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
