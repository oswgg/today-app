import { Provider } from '@nestjs/common';
import { CreateEvent } from 'src/application/use-cases/events/create-event.usecase';
import { ListAllEvents } from 'src/application/use-cases/events/list-all-events.usecase';
import { EVENTS_REPOSITORY_TOKEN } from 'src/domain/repositories/events.repository';
import { PrismaEventsRepository } from 'src/infrastructure/database/prisma.event.repository.impl';
import { PrismaService } from 'src/infrastructure/database/prisma.service';

export const EventsServicesProvider: Provider[] = [
    PrismaService,
    {
        provide: EVENTS_REPOSITORY_TOKEN,
        useClass: PrismaEventsRepository,
    },
];

export const EventsUseCaseProviders: Provider[] = [CreateEvent, ListAllEvents];
