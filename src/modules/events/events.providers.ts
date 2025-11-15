import { Provider } from '@nestjs/common';
import { CreateEvent } from 'src/application/use-cases/events/create-event.usecase';
import { ListAllEvents } from 'src/application/use-cases/events/list-all-events.usecase';
import { GetEventById } from 'src/application/use-cases/events/get-event-by-id.usecase';
import { ListAvailableCategories } from 'src/application/use-cases/events/list-available-categories.usecase';
import { EVENTS_REPOSITORY_TOKEN } from 'src/domain/repositories/events.repository';
import { LOCATION_REPO_TOKEN } from 'src/domain/repositories/location.repository';
import { PrismaEventsRepository } from 'src/infrastructure/database/prisma/prisma.event.repository.impl';
import { PrismaService } from 'src/infrastructure/database/prisma/prisma.service';
import { PrismaLocationRepository } from 'src/infrastructure/database/prisma/prisma.location.repository.impl';

export const EventsServicesProvider: Provider[] = [
    PrismaService,
    {
        provide: EVENTS_REPOSITORY_TOKEN,
        useClass: PrismaEventsRepository,
    },
    {
        provide: LOCATION_REPO_TOKEN,
        useClass: PrismaLocationRepository,
    },
];

export const EventsUseCaseProviders: Provider[] = [
    CreateEvent,
    ListAllEvents,
    GetEventById,
    ListAvailableCategories,
];
