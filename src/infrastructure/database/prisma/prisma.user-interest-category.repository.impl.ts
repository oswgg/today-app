import { Injectable } from '@nestjs/common';
import { UserInterestCategoryRepository } from '../../../domain/repositories/user-interest-category.repository';
import { UserInterestCategoryEntity } from '../../../domain/entities/user-interest-category.entity';
import { CategoryEntity } from '../../../domain/entities/category.entity';
import { PrismaClient } from 'generated/prisma';

@Injectable()
export class PrismaUserInterestCategoryRepositoryImpl
    extends PrismaClient
    implements UserInterestCategoryRepository
{
    constructor() {
        super();
    }

    async validateExistingCategoryIds(
        categoryIds: (number | bigint)[],
    ): Promise<(number | bigint)[]> {
        const categoryIdsBigInt = categoryIds.map((id) => BigInt(id));

        const existingCategories = await this.category.findMany({
            where: {
                id: {
                    in: categoryIdsBigInt,
                },
            },
            select: {
                id: true,
            },
        });

        return existingCategories.map((cat) => cat.id);
    }

    async addInterestCategories(
        userId: number | bigint,
        categoryIds: (number | bigint)[],
    ): Promise<UserInterestCategoryEntity[]> {
        const userIdBigInt = BigInt(userId);
        const categoryIdsBigInt = categoryIds.map((id) => BigInt(id));

        // Create multiple records at once, skip duplicates
        const data = categoryIdsBigInt.map((categoryId) => ({
            user_id: userIdBigInt,
            category_id: categoryId,
        }));

        // Use createMany with skipDuplicates to avoid errors
        await this.userInterestCategory.createMany({
            data,
            skipDuplicates: true,
        });

        // Fetch the created/existing records
        const interests = await this.userInterestCategory.findMany({
            where: {
                user_id: userIdBigInt,
                category_id: {
                    in: categoryIdsBigInt,
                },
            },
        });

        return interests.map((interest) => ({
            id: interest.id,
            userId: interest.user_id,
            categoryId: interest.category_id,
            createdAt: interest.created_at,
        }));
    }

    async removeInterestCategories(
        userId: number | bigint,
        categoryIds: (number | bigint)[],
    ): Promise<number> {
        const userIdBigInt = BigInt(userId);
        const categoryIdsBigInt = categoryIds.map((id) => BigInt(id));

        const { count } = await this.userInterestCategory.deleteMany({
            where: {
                user_id: userIdBigInt,
                category_id: {
                    in: categoryIdsBigInt,
                },
            },
        });

        return count;
    }

    async getUserInterestCategories(
        userId: number | bigint,
    ): Promise<CategoryEntity[]> {
        const userIdBigInt = BigInt(userId);

        const interests = await this.userInterestCategory.findMany({
            where: {
                user_id: userIdBigInt,
            },
            include: {
                category: true,
            },
        });

        return interests.map((interest) => ({
            id: interest.category.id,
            name: interest.category.name,
            description: interest.category.description,
        }));
    }

    async isUserInterestedInCategory(
        userId: number | bigint,
        categoryId: number | bigint,
    ): Promise<boolean> {
        const userIdBigInt = BigInt(userId);
        const categoryIdBigInt = BigInt(categoryId);

        const interest = await this.userInterestCategory.findFirst({
            where: {
                user_id: userIdBigInt,
                category_id: categoryIdBigInt,
            },
        });

        return interest !== null;
    }
}
