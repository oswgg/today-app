import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { I18nService } from 'nestjs-i18n';
import {
    EVENTS_REPOSITORY_TOKEN,
    EventsRepository,
} from 'src/domain/repositories/events.repository';
import { I18nTranslations } from 'src/i18n/generated/i18n.generated';

@Injectable()
export class DeleteEvent {
    constructor(
        @Inject(EVENTS_REPOSITORY_TOKEN)
        private readonly eventsRepository: EventsRepository,
        private readonly translator: I18nService<I18nTranslations>,
    ) {}

    async execute(id: number): Promise<void> {
        const event = await this.eventsRepository.findById(id);

        if (!event) {
            throw new NotFoundException(
                this.translator.t('events.errors.event_not_found'),
            );
        }

        await this.eventsRepository.deleteById(id);
    }
}
