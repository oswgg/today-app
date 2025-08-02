import { Inject } from '@nestjs/common';
import { EventEntity } from 'src/domain/entities/event.entity';
import {
    EVENTS_REPOSITORY_TOKEN,
    EventsRepository,
} from 'src/domain/repositories/events.repository';

export class ListAllEvents {
    constructor(
        @Inject(EVENTS_REPOSITORY_TOKEN)
        private readonly eventsRepository: EventsRepository,
    ) {}

    async execute(): Promise<EventEntity[]> {
        return await this.eventsRepository.findAll();
    }
}
