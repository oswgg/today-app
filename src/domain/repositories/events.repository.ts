import { QueryOptions } from 'src/application/dtos/shared/query-options.dto';
import { EventEntity } from '../entities/event.entity';
import { CreateEventDto } from 'src/application/dtos/events/create-event.dto';

export interface EventsRepository {
    create(data: CreateEventDto): Promise<EventEntity>;
    findById(id: number): Promise<EventEntity | null>;
    findAll(options?: QueryOptions<EventEntity>): Promise<EventEntity[]>;
}

export const EVENTS_REPOSITORY_TOKEN = Symbol('events.repository');
