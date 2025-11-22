import { Injectable } from '@nestjs/common';
import { UserInterestLocationRepository } from '../../../domain/repositories/user-interest-location.repository';
import { UserInterestLocationEntity } from '../../../domain/entities/user-interest-location.entity';
import { LocationEntity } from '../../../domain/entities/location.entity';
import { PrismaClient } from 'generated/prisma';

@Injectable()
export class PrismaUserInterestLocationRepositoryImpl
    extends PrismaClient
    implements UserInterestLocationRepository
{
    constructor() {
        super();
    }

    async validateExistingLocationIds(
        locationIds: (number | bigint)[],
    ): Promise<(number | bigint)[]> {
        const locationIdsBigInt = locationIds.map((id) => BigInt(id));

        const existingLocations = await this.location.findMany({
            where: {
                id: {
                    in: locationIdsBigInt,
                },
            },
            select: {
                id: true,
            },
        });

        return existingLocations.map((loc) => loc.id);
    }

    async addInterestLocations(
        userId: number | bigint,
        locationIds: (number | bigint)[],
    ): Promise<UserInterestLocationEntity[]> {
        const userIdBigInt = BigInt(userId);
        const locationIdsBigInt = locationIds.map((id) => BigInt(id));

        const data = locationIdsBigInt.map((locationId) => ({
            user_id: userIdBigInt,
            location_id: locationId,
        }));

        await this.userInterestLocation.createMany({
            data,
            skipDuplicates: true,
        });

        const interests = await this.userInterestLocation.findMany({
            where: {
                user_id: userIdBigInt,
                location_id: {
                    in: locationIdsBigInt,
                },
            },
        });

        return interests.map((interest) => ({
            id: Number(interest.id),
            userId: Number(interest.user_id),
            locationId: Number(interest.location_id),
            createdAt: interest.created_at,
        }));
    }

    async removeInterestLocations(
        userId: number | bigint,
        locationIds: (number | bigint)[],
    ): Promise<number> {
        const userIdBigInt = BigInt(userId);
        const locationIdsBigInt = locationIds.map((id) => BigInt(id));

        const { count } = await this.userInterestLocation.deleteMany({
            where: {
                user_id: userIdBigInt,
                location_id: {
                    in: locationIdsBigInt,
                },
            },
        });

        return count;
    }

    async getUserInterestLocations(
        userId: number | bigint,
    ): Promise<LocationEntity[]> {
        const userIdBigInt = BigInt(userId);

        const interests = await this.userInterestLocation.findMany({
            where: {
                user_id: userIdBigInt,
            },
            include: {
                location: true,
            },
        });

        return interests.map((interest) => ({
            id: Number(interest.location.id),
            name: interest.location.name,
            address: interest.location.address,
            city: interest.location.city,
            lat: interest.location.lat,
            lng: interest.location.lng,
            description: interest.location.description,
            phone: interest.location.phone,
            email: interest.location.email,
            website: interest.location.website,
            image_url: interest.location.image_url,
            creator_id: Number(interest.location.creator_id),
            created_at: interest.location.created_at,
        }));
    }

    async isUserInterestedInLocation(
        userId: number | bigint,
        locationId: number | bigint,
    ): Promise<boolean> {
        const userIdBigInt = BigInt(userId);
        const locationIdBigInt = BigInt(locationId);

        const interest = await this.userInterestLocation.findFirst({
            where: {
                user_id: userIdBigInt,
                location_id: locationIdBigInt,
            },
        });

        return interest !== null;
    }
}
