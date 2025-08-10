import { Provider } from '@nestjs/common';
import { CreateVenue } from 'src/application/use-cases/venues/create-venue.usecase';
import { ListVenues } from 'src/application/use-cases/venues/list-venues.usecase';
import { VENUE_REPO_TOKEN } from 'src/domain/repositories/venue.repository';
import { PrismaVenueRepository } from 'src/infrastructure/database/prisma/prisma.venue.repository.impl';
import { BelongingGuard } from '../shared/guards/belonging.guard';
import { PrismaService } from 'src/infrastructure/database/prisma/prisma.service';
import { RESOURCE_OWNER_SERVICE } from 'src/domain/services/resource-owner.service';
import { PrismaResourceOwnerService } from 'src/infrastructure/database/prisma/prisma.resource-owner.service.impl';
import { FILE_SERVICE_TOKEN } from 'src/domain/services/files.service';
import { PureFileService } from 'src/infrastructure/services/pure.service.impl';
import { UpdateVenue } from 'src/application/use-cases/venues/update-venue.usecase';
import { DeleteVenue } from 'src/application/use-cases/venues/delete-venue.usecase';

export const VenuesServicesProviders: Provider[] = [
    PrismaService,
    {
        provide: VENUE_REPO_TOKEN,
        useClass: PrismaVenueRepository,
    },
    {
        provide: RESOURCE_OWNER_SERVICE,
        useClass: PrismaResourceOwnerService,
    },
    {
        provide: FILE_SERVICE_TOKEN,
        useClass: PureFileService,
    },
    BelongingGuard,
];
export const VenuesUseCasesProviders: Provider[] = [
    ListVenues,
    CreateVenue,
    UpdateVenue,
    DeleteVenue,
];
