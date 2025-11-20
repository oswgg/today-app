import { Provider } from '@nestjs/common';
import { CreateEvent } from 'src/application/use-cases/events/create-event.usecase';
import { ListAllEvents } from 'src/application/use-cases/events/list-all-events.usecase';
import { GetEventById } from 'src/application/use-cases/events/get-event-by-id.usecase';
import { DeleteEvent } from 'src/application/use-cases/events/delete-event.usecase';
import { ListAvailableCategories } from 'src/application/use-cases/events/list-available-categories.usecase';
import { EVENTS_REPOSITORY_TOKEN } from 'src/domain/repositories/events.repository';
import { LOCATION_REPO_TOKEN } from 'src/domain/repositories/location.repository';
import { PrismaEventsRepository } from 'src/infrastructure/database/prisma/prisma.event.repository.impl';
import { PrismaService } from 'src/infrastructure/database/prisma/prisma.service';
import { PrismaLocationRepository } from 'src/infrastructure/database/prisma/prisma.location.repository.impl';
import { RESOURCE_OWNER_SERVICE } from 'src/domain/services/resource-owner.service';
import { PrismaResourceOwnerService } from 'src/infrastructure/database/prisma/prisma.resource-owner.service.impl';

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
    {
        provide: RESOURCE_OWNER_SERVICE,
        useClass: PrismaResourceOwnerService,
    },
];

export const EventsUseCaseProviders: Provider[] = [
    CreateEvent,
    ListAllEvents,
    GetEventById,
    DeleteEvent,
    ListAvailableCategories,
];
