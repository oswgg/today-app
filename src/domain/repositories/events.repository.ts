import { EventEntity } from '../entities/event.entity';
import { CreateEventDto } from 'src/application/dtos/events/create-event.dto';
import { EventQueryOptions } from 'src/infrastructure/database/prisma/prisma.event.repository.impl';
import { CategoryEntity } from '../entities/category.entity';
export interface EventsRepository {
    create(data: CreateEventDto): Promise<EventEntity>;
    findById(id: number): Promise<EventEntity | null>;
    findAll(options?: EventQueryOptions): Promise<EventEntity[]>;
    listAvailableCategories(): Promise<CategoryEntity[]>;
}

export const EVENTS_REPOSITORY_TOKEN = Symbol('events.repository');
