import { EventsRepository } from 'src/domain/repositories/events.repository';
import { PrismaService } from './prisma.service';
import { EventEntity } from 'src/domain/entities/event.entity';
import { InternalServerErrorException } from '@nestjs/common';
import { CreateEventDto } from 'src/application/dtos/events/create-event.dto';
import { QueryOptions } from 'src/application/dtos/shared/query-options.dto';
import { Prisma } from 'generated/prisma';
import { PrismaEventMapper } from '../mappers/prisma.event.mapper';

export type EventRelations = keyof Prisma.EventInclude;
export type EventQueryOptions = QueryOptions<EventEntity>;

export interface Includes {
    categories: boolean;
    organizer: boolean;
}

export class PrismaEventsRepository
    extends PrismaService<EventEntity, Prisma.EventFindManyArgs>
    implements EventsRepository
{
    async create(data: CreateEventDto): Promise<EventEntity> {
        const {
            title,
            start_time,
            end_time,
            organizer_id,
            lat,
            lng,
            location,
            categories,
        } = data;

        const _event = await this.event.create({
            data: {
                title,
                organizer_id,
                start_time,
                end_time,
                location,
                lat,
                lng,
            },
        });

        if (categories) {
            await this.eventCategories.createMany({
                data: categories.map((category) => ({
                    category_id: category,
                    event_id: _event.id,
                })),
            });
        }

        if (!_event) {
            throw new InternalServerErrorException('Failed to create event');
        }

        return PrismaEventMapper.toEntity(_event);
    }

    async findById(id: number): Promise<EventEntity | null> {
        return await this.event.findUnique({ where: { id } });
    }

    async findAll(queryOptions?: EventQueryOptions): Promise<EventEntity[]> {
        const _events = await this.event.findMany(
            this.buildQuery(queryOptions),
        );

        return _events.map(PrismaEventMapper.toEntity);
    }
}
