import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { EventEntity } from 'src/domain/entities/event.entity';
import {
    EVENTS_REPOSITORY_TOKEN,
    EventsRepository,
} from 'src/domain/repositories/events.repository';
import { I18nService } from 'nestjs-i18n';

@Injectable()
export class GetEventById {
    constructor(
        @Inject(EVENTS_REPOSITORY_TOKEN)
        private eventsRepository: EventsRepository,
        private readonly i18n: I18nService,
    ) {}

    async execute(id: number): Promise<EventEntity> {
        const event = await this.eventsRepository.findById(id);

        if (!event) {
            throw new NotFoundException(
                await this.i18n.translate('events.errors.not_found'),
            );
        }

        return event;
    }
}
