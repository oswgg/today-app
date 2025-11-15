import { Provider } from '@nestjs/common';
import { CreateLocation } from 'src/application/use-cases/locations/create-location.usecase';
import { ListLocations } from 'src/application/use-cases/locations/list-locations.usecase';
import { LOCATION_REPO_TOKEN } from 'src/domain/repositories/location.repository';
import { PrismaLocationRepository } from 'src/infrastructure/database/prisma/prisma.location.repository.impl';
import { BelongingGuard } from '../shared/guards/belonging.guard';
import { PrismaService } from 'src/infrastructure/database/prisma/prisma.service';
import { RESOURCE_OWNER_SERVICE } from 'src/domain/services/resource-owner.service';
import { PrismaResourceOwnerService } from 'src/infrastructure/database/prisma/prisma.resource-owner.service.impl';
import { FILE_SERVICE_TOKEN } from 'src/domain/services/files.service';
import { PureFileService } from 'src/infrastructure/services/pure.service.impl';
import { UpdateLocation } from 'src/application/use-cases/locations/update-location.usecase';
import { DeleteLocation } from 'src/application/use-cases/locations/delete-location.usecase';

export const VenuesServicesProviders: Provider[] = [
    PrismaService,
    {
        provide: LOCATION_REPO_TOKEN,
        useClass: PrismaLocationRepository,
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
    ListLocations,
    CreateLocation,
    UpdateLocation,
    DeleteLocation,
];
