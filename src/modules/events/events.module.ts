import { Module } from '@nestjs/common';
import {
    EventsServicesProvider,
    EventsUseCaseProviders,
} from './events.providers';
import { PublicEventsController } from './public-events.controller';
import { ManagementEventsController } from './management-events.controller';

@Module({
    providers: [...EventsServicesProvider, ...EventsUseCaseProviders],
    controllers: [ManagementEventsController, PublicEventsController],
})
export class EventsModule {}
