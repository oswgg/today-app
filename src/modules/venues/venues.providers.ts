import { Provider } from '@nestjs/common';
import { CreateVenue } from 'src/application/use-cases/venues/create-venue.usecase';
import { ListVenues } from 'src/application/use-cases/venues/list-venues.usecase';
import { VENUE_REPO_TOKEN } from 'src/domain/repositories/venue.repository';
import { PrismaVenueRepository } from 'src/infrastructure/database/prisma/prisma.venue.repository.impl';

export const VenuesServicesProviders: Provider[] = [
    {
        provide: VENUE_REPO_TOKEN,
        useClass: PrismaVenueRepository,
    },
];
export const VenuesUseCasesProviders: Provider[] = [ListVenues, CreateVenue];
