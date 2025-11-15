import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { I18nService } from 'nestjs-i18n';
import { CreateEventDto } from 'src/application/dtos/events/create-event.dto';
import { EventEntity } from 'src/domain/entities/event.entity';
import {
    EVENTS_REPOSITORY_TOKEN,
    EventsRepository,
} from 'src/domain/repositories/events.repository';
import {
    LOCATION_REPO_TOKEN,
    LocationRepository,
} from 'src/domain/repositories/location.repository';
import { I18nTranslations } from 'src/i18n/generated/i18n.generated';

@Injectable()
export class CreateEvent {
    constructor(
        @Inject(EVENTS_REPOSITORY_TOKEN)
        private readonly eventsRepository: EventsRepository,
        @Inject(LOCATION_REPO_TOKEN)
        private readonly locationRepository: LocationRepository,
        private readonly translator: I18nService<I18nTranslations>,
    ) {}

    async execute(data: CreateEventDto): Promise<EventEntity> {
        const { start_time, end_time } = data;

        if (end_time && start_time > end_time) {
            throw new BadRequestException(
                this.translator.t('events.errors.start_time_before_end_time'),
            );
        }

        const _location = await this.locationRepository.findById(
            data.location_id,
        );
        if (!_location) {
            throw new BadRequestException(
                this.translator.t('locations.errors.not_found'),
            );
        }

        return await this.eventsRepository.create(data);
    }
}
