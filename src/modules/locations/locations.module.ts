import { Module } from '@nestjs/common';
import { PublicLocationsController } from './public-locations.controller';
import { ManagementLocationsController } from './management-locations.controller';
import {
    VenuesServicesProviders,
    VenuesUseCasesProviders,
} from './locations.providers';

@Module({
    providers: [...VenuesServicesProviders, ...VenuesUseCasesProviders],
    controllers: [ManagementLocationsController, PublicLocationsController],
})
export class LocationsModule {}
