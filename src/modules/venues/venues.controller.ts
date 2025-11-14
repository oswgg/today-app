import {
    Body,
    Controller,
    Delete,
    Get,
    HttpCode,
    HttpStatus,
    Param,
    ParseIntPipe,
    Post,
    Put,
    UploadedFile,
    UseGuards,
    UseInterceptors,
} from '@nestjs/common';
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
import { InputUpdateVenueDto } from 'src/application/dtos/venues/update-venue.dto';
import { ZodUpdateVenueSchema } from 'src/infrastructure/http/validator/zod/venues/zod.update-venue.schema';
import { BelongsTo } from '../shared/decorators/belongs.decorator';
import { BelongingGuard } from '../shared/guards/belonging.guard';
import { FileInterceptor } from '@nestjs/platform-express';
import { MulterConfigFactory } from 'src/config/multer.config';
import { UpdateVenue } from 'src/application/use-cases/venues/update-venue.usecase';
import { DeleteVenue } from 'src/application/use-cases/venues/delete-venue.usecase';

@Controller('venues')
export class VenuesController {
    constructor(
        private readonly listVenues: ListVenues,
        private readonly createVenue: CreateVenue,
        private readonly updateVenue: UpdateVenue,
        private readonly deleteVenue: DeleteVenue,
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
            creator_id: user.id,
        });
    }

    @Put('/:id')
    @UseGuards(OrganizerGuard, BelongingGuard)
    @BelongsTo({
        table: 'venues',
        owner: 'creator_id',
        identify: 'id',
        entity: 'Venue',
    })
    @UseInterceptors(FileInterceptor('image', MulterConfigFactory.images))
    async update(
        @UploadedFile() file: Express.Multer.File,
        @Param('id', ParseIntPipe) id: number,
        @Body(new ValidationPipe(new ZodValidator(ZodUpdateVenueSchema)))
        body: InputUpdateVenueDto,
    ) {
        if (file) {
            body.image_url = file.path;
        }

        return await this.updateVenue.execute(id, body);
    }

    @Delete('/:id')
    @HttpCode(HttpStatus.NO_CONTENT)
    @UseGuards(OrganizerGuard, BelongingGuard)
    @BelongsTo({
        table: 'venues',
        owner: 'creator_id',
        identify: 'id',
        message_path: 'venues.errors.not_found',
    })
    async delete(@Param('id', ParseIntPipe) id: number) {
        return await this.deleteVenue.execute(id);
    }
}
