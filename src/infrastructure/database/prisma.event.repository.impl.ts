import { EventsRepository } from 'src/domain/repositories/events.repository';
import { PrismaService } from './prisma.service';
import { EventEntity } from 'src/domain/entities/event.entity';
import { InternalServerErrorException } from '@nestjs/common';
import { CreateEventDto } from 'src/application/dtos/events/create-event.dto';
import { QueryOptions } from 'src/application/dtos/shared/query-options.dto';

export class PrismaEventsRepository
    extends PrismaService
    implements EventsRepository
{
    async create(data: CreateEventDto): Promise<EventEntity> {
        const { title, start_time, end_time, location } = data;

        const _event = await this.events.create({
            data: { title, start_time, end_time, location },
        });

        if (!_event) {
            throw new InternalServerErrorException('Failed to create event');
        }

        return _event;
    }

    async findById(id: number): Promise<EventEntity | null> {
        return await this.events.findUnique({ where: { id } });
    }

    async findAll(options?: QueryOptions<EventEntity>): Promise<EventEntity[]> {
        return await this.events.findMany({
            where: options?.where,
            orderBy: options?.sort,
            take: options?.limit,
            skip: options?.offset,
        });
    }
}
