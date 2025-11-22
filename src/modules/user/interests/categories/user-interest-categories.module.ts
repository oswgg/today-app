import { Module } from '@nestjs/common';
import { UserInterestCategoriesController } from './user-interest-categories.controller';
import { AddInterestCategories } from 'src/application/use-cases/user/interests/categories/add-interest-categories.usecase';
import { RemoveInterestCategories } from 'src/application/use-cases/user/interests/categories/remove-interest-categories.usecase';
import { ListUserInterestCategories } from 'src/application/use-cases/user/interests/categories/list-user-interest-categories.usecase';
import { IsUserInterested } from 'src/application/use-cases/user/interests/categories/is-user-interested-category.usecase';
import { USER_INTEREST_CATEGORY_REPO_TOKEN } from 'src/domain/repositories/user-interest-category.repository';
import { PrismaUserInterestCategoryRepositoryImpl } from 'src/infrastructure/database/prisma/prisma.user-interest-category.repository.impl';
import { PrismaService } from 'src/infrastructure/database/prisma/prisma.service';

@Module({
    controllers: [UserInterestCategoriesController],
    providers: [
        PrismaService,
        {
            provide: USER_INTEREST_CATEGORY_REPO_TOKEN,
            useClass: PrismaUserInterestCategoryRepositoryImpl,
        },
        AddInterestCategories,
        RemoveInterestCategories,
        ListUserInterestCategories,
        IsUserInterested,
    ],
})
export class UserInterestCategoriesModule {}
