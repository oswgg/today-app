import { Injectable } from '@nestjs/common';
import { UserInterestOrganizerRepository } from '../../../domain/repositories/user-interest-organizer.repository';
import { UserInterestOrganizerEntity } from '../../../domain/entities/user-interest-organizer.entity';
import { PrismaClient } from 'generated/prisma';

@Injectable()
export class PrismaUserInterestOrganizerRepositoryImpl
    extends PrismaClient
    implements UserInterestOrganizerRepository
{
    constructor() {
        super();
    }

    async validateExistingOrganizerIds(
        organizerIds: (number | bigint)[],
    ): Promise<(number | bigint)[]> {
        const organizerIdsBigInt = organizerIds.map((id) => BigInt(id));

        const existingOrganizers = await this.organizerProfile.findMany({
            where: {
                id: {
                    in: organizerIdsBigInt,
                },
            },
            select: {
                id: true,
            },
        });

        return existingOrganizers.map((org) => org.id);
    }

    async addInterestOrganizers(
        userId: number | bigint,
        organizerIds: (number | bigint)[],
    ): Promise<UserInterestOrganizerEntity[]> {
        const userIdBigInt = BigInt(userId);
        const organizerIdsBigInt = organizerIds.map((id) => BigInt(id));

        const data = organizerIdsBigInt.map((organizerId) => ({
            user_id: userIdBigInt,
            organizer_id: organizerId,
        }));

        await this.userInterestOrganizer.createMany({
            data,
            skipDuplicates: true,
        });

        const interests = await this.userInterestOrganizer.findMany({
            where: {
                user_id: userIdBigInt,
                organizer_id: {
                    in: organizerIdsBigInt,
                },
            },
        });

        return interests.map((interest) => ({
            id: Number(interest.id),
            userId: Number(interest.user_id),
            organizerId: Number(interest.organizer_id),
            createdAt: interest.created_at,
        }));
    }

    async removeInterestOrganizers(
        userId: number | bigint,
        organizerIds: (number | bigint)[],
    ): Promise<number> {
        const userIdBigInt = BigInt(userId);
        const organizerIdsBigInt = organizerIds.map((id) => BigInt(id));

        const { count } = await this.userInterestOrganizer.deleteMany({
            where: {
                user_id: userIdBigInt,
                organizer_id: {
                    in: organizerIdsBigInt,
                },
            },
        });

        return count;
    }

    async getUserInterestOrganizers(userId: number | bigint): Promise<any[]> {
        const userIdBigInt = BigInt(userId);

        const interests = await this.userInterestOrganizer.findMany({
            where: {
                user_id: userIdBigInt,
            },
            include: {
                organizer: {
                    include: {
                        user: true,
                    },
                },
            },
        });

        return interests.map((interest) => ({
            id: Number(interest.organizer.id),
            userId: Number(interest.organizer.userId),
            user: {
                id: Number(interest.organizer.user.id),
                name: interest.organizer.user.name,
                email: interest.organizer.user.email,
            },
        }));
    }

    async isUserInterestedInOrganizer(
        userId: number | bigint,
        organizerId: number | bigint,
    ): Promise<boolean> {
        const userIdBigInt = BigInt(userId);
        const organizerIdBigInt = BigInt(organizerId);

        const interest = await this.userInterestOrganizer.findFirst({
            where: {
                user_id: userIdBigInt,
                organizer_id: organizerIdBigInt,
            },
        });

        return interest !== null;
    }
}
