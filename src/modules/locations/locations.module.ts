import { Module } from '@nestjs/common';
import { LocationsController } from './locations.controller';
import {
    VenuesServicesProviders,
    VenuesUseCasesProviders,
} from './locations.providers';

@Module({
    providers: [...VenuesServicesProviders, ...VenuesUseCasesProviders],
    controllers: [LocationsController],
})
export class LocationsModule {}
