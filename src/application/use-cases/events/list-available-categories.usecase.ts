import { Inject, Injectable } from '@nestjs/common';
import { CategoryEntity } from 'src/domain/entities/category.entity';
import {
    EVENTS_REPOSITORY_TOKEN,
    EventsRepository,
} from 'src/domain/repositories/events.repository';

@Injectable()
export class ListAvailableCategories {
    constructor(
        @Inject(EVENTS_REPOSITORY_TOKEN)
        private readonly eventsRepo: EventsRepository,
    ) {}

    async execute(): Promise<CategoryEntity[]> {
        return await this.eventsRepo.listAvailableCategories();
    }
}
