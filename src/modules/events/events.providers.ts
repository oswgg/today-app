import { Provider } from '@nestjs/common';
import { CreateEvent } from 'src/application/use-cases/events/create-event.usecase';
import { ListAllEvents } from 'src/application/use-cases/events/list-all-events.usecase';
import { ListAvailableCategories } from 'src/application/use-cases/events/list-available-categories.usecase';
import { EVENTS_REPOSITORY_TOKEN } from 'src/domain/repositories/events.repository';
import { VENUE_REPO_TOKEN } from 'src/domain/repositories/venue.repository';
import { PrismaEventsRepository } from 'src/infrastructure/database/prisma/prisma.event.repository.impl';
import { PrismaService } from 'src/infrastructure/database/prisma/prisma.service';
import { PrismaVenueRepository } from 'src/infrastructure/database/prisma/prisma.venue.repository.impl';

export const EventsServicesProvider: Provider[] = [
    PrismaService,
    {
        provide: EVENTS_REPOSITORY_TOKEN,
        useClass: PrismaEventsRepository,
    },
    {
        provide: VENUE_REPO_TOKEN,
        useClass: PrismaVenueRepository,
    },
];

export const EventsUseCaseProviders: Provider[] = [
    CreateEvent,
    ListAllEvents,
    ListAvailableCategories,
];
