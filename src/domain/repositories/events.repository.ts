import { EventEntity } from '../entities/event.entity';
import { CreateEventDto } from 'src/application/dtos/events/create-event.dto';
import { EventQueryOptions } from 'src/infrastructure/database/prisma.event.repository.impl';

export interface EventsRepository {
    create(data: CreateEventDto): Promise<EventEntity>;
    findById(id: number): Promise<EventEntity | null>;
    findAll(options?: EventQueryOptions): Promise<EventEntity[]>;
}

export const EVENTS_REPOSITORY_TOKEN = Symbol('events.repository');
