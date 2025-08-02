import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { CreateEventDto } from 'src/application/dtos/events/create-event.dto';
import { EventEntity } from 'src/domain/entities/event.entity';
import {
    EVENTS_REPOSITORY_TOKEN,
    EventsRepository,
} from 'src/domain/repositories/events.repository';

@Injectable()
export class CreateEvent {
    constructor(
        @Inject(EVENTS_REPOSITORY_TOKEN)
        private readonly eventsRepository: EventsRepository,
    ) {}

    async execute(data: CreateEventDto): Promise<EventEntity> {
        const { start_time, end_time } = data;

        if (end_time && start_time > end_time) {
            throw new BadRequestException('Start time must be before end time');
        }

        return await this.eventsRepository.create(data);
    }
}
