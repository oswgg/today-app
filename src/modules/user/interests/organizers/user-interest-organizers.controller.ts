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
import { AddInterestOrganizersDto } from 'src/application/dtos/user/interests/organizers/add-interest-organizers.dto';
import { RemoveInterestOrganizersDto } from 'src/application/dtos/user/interests/organizers/remove-interest-organizers.dto';
import { AddInterestOrganizers } from 'src/application/use-cases/user/interests/organizers/add-interest-organizers.usecase';
import { RemoveInterestOrganizers } from 'src/application/use-cases/user/interests/organizers/remove-interest-organizers.usecase';
import { ListUserInterestOrganizers } from 'src/application/use-cases/user/interests/organizers/list-user-interest-organizers.usecase';
import { IsUserInterestedInOrganizer } from 'src/application/use-cases/user/interests/organizers/is-user-interested-organizer.usecase';
import { UserRoleGuard } from '../../../shared/guards/user-role.guard';
import { RequiredRole } from '../../../shared/decorators/required-user-role.decorator';
import { UserRole } from 'src/domain/types/user-role.enum';
import { User } from '../../../shared/decorators/user.decorator';
import { JwtUserPayload } from 'src/domain/entities/auth/jwt-payload.entity';
import { ZodValidator } from 'src/infrastructure/http/validator/zod/zod.validator';
import { ZodAddInterestOrganizersSchema } from 'src/infrastructure/http/validator/zod/user/interests/organizers/zod.add-interest-organizers.schema';
import { ValidationPipe } from '../../../shared/pipes/validation.pipe';
import { ZodRemoveInterestOrganizersSchema } from 'src/infrastructure/http/validator/zod/user/interests/organizers/zod.remove-interest-organizers.schema';
import {
    ApiListUserInterestOrganizers,
    ApiAddInterestOrganizers,
    ApiRemoveInterestOrganizers,
    ApiCheckInterestInOrganizer,
} from './user-interest-organizers.swagger';

@ApiTags('User Interests - Organizers')
@ApiBearerAuth('JWT-auth')
@Controller('user/interests/organizers')
@UseGuards(UserRoleGuard)
@RequiredRole([UserRole.USER])
export class UserInterestOrganizersController {
    constructor(
        private readonly addInterests: AddInterestOrganizers,
        private readonly removeInterests: RemoveInterestOrganizers,
        private readonly listInterests: ListUserInterestOrganizers,
        private readonly isInterested: IsUserInterestedInOrganizer,
    ) {}

    @Get()
    @ApiListUserInterestOrganizers()
    async list(@User() user: JwtUserPayload) {
        return this.listInterests.execute(user.id);
    }

    @Post()
    @ApiAddInterestOrganizers()
    async add(
        @User() user: JwtUserPayload,
        @Body(
            new ValidationPipe(
                new ZodValidator(ZodAddInterestOrganizersSchema),
            ),
        )
        body: AddInterestOrganizersDto,
    ) {
        return this.addInterests.execute(user.id, body.organizerIds);
    }

    @Delete()
    @ApiRemoveInterestOrganizers()
    async remove(
        @User() user: JwtUserPayload,
        @Body(
            new ValidationPipe(
                new ZodValidator(ZodRemoveInterestOrganizersSchema),
            ),
        )
        body: RemoveInterestOrganizersDto,
    ) {
        return this.removeInterests.execute(user.id, body.organizerIds);
    }

    @Get(':organizerId')
    @ApiCheckInterestInOrganizer()
    async checkInterestInOrganizer(
        @User() user: JwtUserPayload,
        @Param('organizerId', ParseIntPipe) organizerId: number,
    ) {
        const interested = await this.isInterested.execute(
            user.id,
            organizerId,
        );
        return { interested };
    }
}
