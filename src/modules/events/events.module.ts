import { Module } from '@nestjs/common';
import {
    EventsServicesProvider,
    EventsUseCaseProviders,
} from './events.providers';
import { EventsController } from './events.controller';

@Module({
    providers: [...EventsServicesProvider, ...EventsUseCaseProviders],
    controllers: [EventsController],
})
export class EventsModule {}
