import { Injectable } from '@nestjs/common';
import { UserInterestEventRepository } from '../../../domain/repositories/user-interest-event.repository';
import { UserInterestEventEntity } from '../../../domain/entities/users/interests/user-interest-event.entity';
import { EventEntity } from '../../../domain/entities/event.entity';
import { PrismaClient } from 'generated/prisma';

@Injectable()
export class PrismaUserInterestEventRepositoryImpl
    extends PrismaClient
    implements UserInterestEventRepository
{
    constructor() {
        super();
    }

    async validateExistingEventIds(
        eventIds: (number | bigint)[],
    ): Promise<(number | bigint)[]> {
        const eventIdsBigInt = eventIds.map((id) => BigInt(id));

        const existingEvents = await this.event.findMany({
            where: {
                id: {
                    in: eventIdsBigInt,
                },
            },
            select: {
                id: true,
            },
        });

        return existingEvents.map((evt) => evt.id);
    }

    async addInterestEvents(
        userId: number | bigint,
        eventIds: (number | bigint)[],
    ): Promise<UserInterestEventEntity[]> {
        const userIdBigInt = BigInt(userId);
        const eventIdsBigInt = eventIds.map((id) => BigInt(id));

        const data = eventIdsBigInt.map((eventId) => ({
            user_id: userIdBigInt,
            event_id: eventId,
        }));

        await this.userInterestEvent.createMany({
            data,
            skipDuplicates: true,
        });

        const interests = await this.userInterestEvent.findMany({
            where: {
                user_id: userIdBigInt,
                event_id: {
                    in: eventIdsBigInt,
                },
            },
        });

        return interests.map((interest) => ({
            id: Number(interest.id),
            userId: Number(interest.user_id),
            eventId: Number(interest.event_id),
            createdAt: interest.created_at,
        }));
    }

    async removeInterestEvents(
        userId: number | bigint,
        eventIds: (number | bigint)[],
    ): Promise<number> {
        const userIdBigInt = BigInt(userId);
        const eventIdsBigInt = eventIds.map((id) => BigInt(id));

        const { count } = await this.userInterestEvent.deleteMany({
            where: {
                user_id: userIdBigInt,
                event_id: {
                    in: eventIdsBigInt,
                },
            },
        });

        return count;
    }

    async getUserInterestEvents(
        userId: number | bigint,
    ): Promise<EventEntity[]> {
        const userIdBigInt = BigInt(userId);

        const interests = await this.userInterestEvent.findMany({
            where: {
                user_id: userIdBigInt,
            },
            include: {
                event: true,
            },
        });

        return interests.map((interest) => ({
            id: Number(interest.event.id),
            title: interest.event.title,
            description: interest.event.description,
            start_time: interest.event.start_time,
            end_time: interest.event.end_time,
            locationAddress: interest.event.location,
            lat: interest.event.lat,
            lng: interest.event.lng,
            image_url: interest.event.image_url,
            location_id: interest.event.location_id
                ? Number(interest.event.location_id)
                : null,
            creator_id: Number(interest.event.creator_id),
            created_at: interest.event.created_at,
        }));
    }

    async isUserInterestedInEvent(
        userId: number | bigint,
        eventId: number | bigint,
    ): Promise<boolean> {
        const userIdBigInt = BigInt(userId);
        const eventIdBigInt = BigInt(eventId);

        const interest = await this.userInterestEvent.findFirst({
            where: {
                user_id: userIdBigInt,
                event_id: eventIdBigInt,
            },
        });

        return interest !== null;
    }
}
