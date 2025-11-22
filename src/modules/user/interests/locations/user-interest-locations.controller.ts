import {
    Body,
    Controller,
    Delete,
    Get,
    Param,
    ParseIntPipe,
    Post,
    UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { AddInterestLocationsDto } from 'src/application/dtos/user/interests/locations/add-interest-locations.dto';
import { RemoveInterestLocationsDto } from 'src/application/dtos/user/interests/locations/remove-interest-locations.dto';
import { AddInterestLocations } from 'src/application/use-cases/user/interests/locations/add-interest-locations.usecase';
import { RemoveInterestLocations } from 'src/application/use-cases/user/interests/locations/remove-interest-locations.usecase';
import { ListUserInterestLocations } from 'src/application/use-cases/user/interests/locations/list-user-interest-locations.usecase';
import { IsUserInterestedInLocation } from 'src/application/use-cases/user/interests/locations/is-user-interested-location.usecase';
import { UserRoleGuard } from '../../../shared/guards/user-role.guard';
import { RequiredRole } from '../../../shared/decorators/required-user-role.decorator';
import { UserRole } from 'src/domain/types/user-role.enum';
import { User } from '../../../shared/decorators/user.decorator';
import { JwtUserPayload } from 'src/domain/entities/jwt-payload.entity';
import { ZodValidator } from 'src/infrastructure/http/validator/zod/zod.validator';
import { ZodAddInterestLocationsSchema } from 'src/infrastructure/http/validator/zod/user/interests/locations/zod.add-interest-locations.schema';
import { ValidationPipe } from '../../../shared/pipes/validation.pipe';
import { ZodRemoveInterestLocationsSchema } from 'src/infrastructure/http/validator/zod/user/interests/locations/zod.remove-interest-locations.schema';
import {
    ApiListUserInterestLocations,
    ApiAddInterestLocations,
    ApiRemoveInterestLocations,
    ApiCheckInterestInLocation,
} from './user-interest-locations.swagger';

@ApiTags('User Interests - Locations')
@ApiBearerAuth('JWT-auth')
@Controller('user/interests/locations')
@UseGuards(UserRoleGuard)
@RequiredRole([UserRole.USER])
export class UserInterestLocationsController {
    constructor(
        private readonly addInterests: AddInterestLocations,
        private readonly removeInterests: RemoveInterestLocations,
        private readonly listInterests: ListUserInterestLocations,
        private readonly isInterested: IsUserInterestedInLocation,
    ) {}

    @Get()
    @ApiListUserInterestLocations()
    async list(@User() user: JwtUserPayload) {
        return this.listInterests.execute(user.id);
    }

    @Post()
    @ApiAddInterestLocations()
    async add(
        @User() user: JwtUserPayload,
        @Body(
            new ValidationPipe(new ZodValidator(ZodAddInterestLocationsSchema)),
        )
        body: AddInterestLocationsDto,
    ) {
        return this.addInterests.execute(user.id, body.locationIds);
    }

    @Delete()
    @ApiRemoveInterestLocations()
    async remove(
        @User() user: JwtUserPayload,
        @Body(
            new ValidationPipe(
                new ZodValidator(ZodRemoveInterestLocationsSchema),
            ),
        )
        body: RemoveInterestLocationsDto,
    ) {
        return this.removeInterests.execute(user.id, body.locationIds);
    }

    @Get(':locationId')
    @ApiCheckInterestInLocation()
    async checkInterestInLocation(
        @User() user: JwtUserPayload,
        @Param('locationId', ParseIntPipe) locationId: number,
    ) {
        const interested = await this.isInterested.execute(user.id, locationId);
        return { interested };
    }
}
