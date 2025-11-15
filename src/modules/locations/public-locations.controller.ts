import { Controller, Get, Param, ParseIntPipe } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { ApiGetAllLocations, ApiGetLocationById } from './locations.swagger';
import { ListLocations } from 'src/application/use-cases/locations/list-locations.usecase';
import { GetLocationById } from 'src/application/use-cases/locations/get-location-by-id.usecase';
import { Public } from '../shared/decorators/public.decorator';

@ApiTags('Locations (Public)')
@Controller('locations')
export class PublicLocationsController {
    constructor(
        private readonly listLocations: ListLocations,
        private readonly getLocationById: GetLocationById,
    ) {}

    @Get('/')
    @Public()
    @ApiGetAllLocations()
    async getAllLocations() {
        return await this.listLocations.execute();
    }

    @Get('/:id')
    @Public()
    @ApiGetLocationById()
    async getLocationDetails(@Param('id', ParseIntPipe) id: number) {
        return await this.getLocationById.execute(id);
    }
}
