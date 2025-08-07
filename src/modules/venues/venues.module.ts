import { Module } from '@nestjs/common';
import { VenuesController } from './venues.controller';
import {
    VenuesServicesProviders,
    VenuesUseCasesProviders,
} from './venues.providers';

@Module({
    providers: [...VenuesServicesProviders, ...VenuesUseCasesProviders],
    controllers: [VenuesController],
})
export class VenuesModule {}
