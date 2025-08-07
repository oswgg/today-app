import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { ValidationPipe } from '../shared/pipes/validation.pipe';
import { ZodValidator } from 'src/infrastructure/http/validator/zod/zod.validator';
import {
    InputCreateVenueDto,
    OutputCreateVenueDto,
} from 'src/application/dtos/venues/create-venue.dto';
import { ZodCreateVenueSchema } from 'src/infrastructure/http/validator/zod/venues/zod.create-venue.schema';
import { User } from '../shared/decorators/user.decorator';
import { JwtUserPayload } from 'src/domain/entities/jwt-payload.entity';
import { CreateVenue } from 'src/application/use-cases/venues';
import { ListVenues } from 'src/application/use-cases/venues/list-venues.usecase';
import { OrganizerGuard } from '../shared/guards/organizer-role.guard';

@Controller('venues')
export class VenuesController {
    constructor(
        private readonly listVenues: ListVenues,
        private readonly createVenue: CreateVenue,
    ) {}
    @Get('/')
    async getAllVenues() {
        return await this.listVenues.execute();
    }

    @UseGuards(OrganizerGuard)
    @Post('/')
    async create(
        @Body(new ValidationPipe(new ZodValidator(ZodCreateVenueSchema)))
        body: InputCreateVenueDto,
        @User() user: JwtUserPayload,
    ): Promise<OutputCreateVenueDto> {
        return await this.createVenue.execute({
            ...body,
            organizer_id: user.id,
        });
    }
}
