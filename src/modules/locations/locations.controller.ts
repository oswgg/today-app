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
import { ApiTags } from '@nestjs/swagger';
import {
    ApiGetAllLocations,
    ApiCreateLocation,
    ApiUpdateLocation,
    ApiDeleteLocation,
} from './locations.swagger';
import { ValidationPipe } from '../shared/pipes/validation.pipe';
import { ZodValidator } from 'src/infrastructure/http/validator/zod/zod.validator';
import {
    InputCreateLocationDto,
    OutputCreateLocationDto,
} from 'src/application/dtos/locations/create-location.dto';
import { User } from '../shared/decorators/user.decorator';
import { JwtUserPayload } from 'src/domain/entities/jwt-payload.entity';
import { CreateLocation } from 'src/application/use-cases/locations';
import { ListLocations } from 'src/application/use-cases/locations/list-locations.usecase';
import { InputUpdateLocationDto } from 'src/application/dtos/locations/update-location.dto';
import { ZodUpdateLocationSchema } from 'src/infrastructure/http/validator/zod/locations/zod.update-location.schema';
import { BelongsTo } from '../shared/decorators/belongs.decorator';
import { BelongingGuard } from '../shared/guards/belonging.guard';
import { FileInterceptor } from '@nestjs/platform-express';
import { MulterConfigFactory } from 'src/config/multer.config';
import { UpdateLocation } from 'src/application/use-cases/locations/update-location.usecase';
import { DeleteLocation } from 'src/application/use-cases/locations/delete-location.usecase';
import { ZodCreateLocationSchema } from 'src/infrastructure/http/validator/zod/locations/zod.create-location.schema';
import { UserRoleGuard } from '../shared/guards/user-role.guard';
import { RequiredRole } from '../shared/decorators/required-user-role.decorator';
import { UserRole } from 'src/domain/types/user-role.enum';

@ApiTags('locations')
@Controller('locations')
export class LocationsController {
    constructor(
        private readonly listVenues: ListLocations,
        private readonly createVenue: CreateLocation,
        private readonly updateVenue: UpdateLocation,
        private readonly deleteVenue: DeleteLocation,
    ) {}
    @Get('/')
    @ApiGetAllLocations()
    async getAllVenues() {
        return await this.listVenues.execute();
    }

    @Post('/')
    @ApiCreateLocation()
    @UseGuards(UserRoleGuard)
    @RequiredRole([UserRole.ORGANIZER, UserRole.INSTITUTION])
    @UseInterceptors(FileInterceptor('image', MulterConfigFactory.images))
    async create(
        @Body(new ValidationPipe(new ZodValidator(ZodCreateLocationSchema)))
        body: InputCreateLocationDto,
        @UploadedFile() file: Express.Multer.File,
        @User() user: JwtUserPayload,
    ): Promise<OutputCreateLocationDto> {
        if (file) {
            body.image_url = file.path;
        }

        return await this.createVenue.execute({
            ...body,
            creator_id: user.id,
        });
    }

    @Put('/:id')
    @UseGuards(UserRoleGuard, BelongingGuard)
    @RequiredRole([UserRole.ORGANIZER, UserRole.INSTITUTION])
    @BelongsTo({
        table: 'locations',
        owner: 'creator_id',
        identify: 'id',
        entity: 'Location',
    })
    @UseInterceptors(FileInterceptor('image', MulterConfigFactory.images))
    @ApiUpdateLocation()
    async update(
        @UploadedFile() file: Express.Multer.File,
        @Param('id', ParseIntPipe) id: number,
        @Body(new ValidationPipe(new ZodValidator(ZodUpdateLocationSchema)))
        body: InputUpdateLocationDto,
    ) {
        if (file) {
            body.image_url = file.path;
        }

        return await this.updateVenue.execute(id, body);
    }

    @Delete('/:id')
    @HttpCode(HttpStatus.NO_CONTENT)
    @UseGuards(UserRoleGuard, BelongingGuard)
    @RequiredRole([UserRole.ORGANIZER, UserRole.INSTITUTION])
    @BelongsTo({
        table: 'locations',
        owner: 'creator_id',
        identify: 'id',
        message_path: 'locations.errors.not_found',
    })
    @ApiDeleteLocation()
    async delete(@Param('id', ParseIntPipe) id: number) {
        return await this.deleteVenue.execute(id);
    }
}
