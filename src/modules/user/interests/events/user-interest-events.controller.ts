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
import { AddInterestEventsDto } from 'src/application/dtos/user/interests/events/add-interest-events.dto';
import { RemoveInterestEventsDto } from 'src/application/dtos/user/interests/events/remove-interest-events.dto';
import { AddInterestEvents } from 'src/application/use-cases/user/interests/events/add-interest-events.usecase';
import { RemoveInterestEvents } from 'src/application/use-cases/user/interests/events/remove-interest-events.usecase';
import { ListUserInterestEvents } from 'src/application/use-cases/user/interests/events/list-user-interest-events.usecase';
import { IsUserInterestedInEvent } from 'src/application/use-cases/user/interests/events/is-user-interested-event.usecase';
import { UserRoleGuard } from '../../../shared/guards/user-role.guard';
import { RequiredRole } from '../../../shared/decorators/required-user-role.decorator';
import { UserRole } from 'src/domain/types/user-role.enum';
import { User } from '../../../shared/decorators/user.decorator';
import { JwtUserPayload } from 'src/domain/entities/auth/jwt-payload.entity';
import { ZodValidator } from 'src/infrastructure/http/validator/zod/zod.validator';
import { ZodAddInterestEventsSchema } from 'src/infrastructure/http/validator/zod/user/interests/events/zod.add-interest-events.schema';
import { ValidationPipe } from '../../../shared/pipes/validation.pipe';
import { ZodRemoveInterestEventsSchema } from 'src/infrastructure/http/validator/zod/user/interests/events/zod.remove-interest-events.schema';
import {
    ApiListUserInterestEvents,
    ApiAddInterestEvents,
    ApiRemoveInterestEvents,
    ApiCheckInterestInEvent,
} from './user-interest-events.swagger';

@ApiTags('User Interests - Events')
@ApiBearerAuth('JWT-auth')
@Controller('user/interests/events')
@UseGuards(UserRoleGuard)
@RequiredRole([UserRole.USER])
export class UserInterestEventsController {
    constructor(
        private readonly addInterests: AddInterestEvents,
        private readonly removeInterests: RemoveInterestEvents,
        private readonly listInterests: ListUserInterestEvents,
        private readonly isInterested: IsUserInterestedInEvent,
    ) {}

    @Get()
    @ApiListUserInterestEvents()
    async list(@User() user: JwtUserPayload) {
        return this.listInterests.execute(user.id);
    }

    @Post()
    @ApiAddInterestEvents()
    async add(
        @User() user: JwtUserPayload,
        @Body(new ValidationPipe(new ZodValidator(ZodAddInterestEventsSchema)))
        body: AddInterestEventsDto,
    ) {
        return this.addInterests.execute(user.id, body.eventIds);
    }

    @Delete()
    @ApiRemoveInterestEvents()
    async remove(
        @User() user: JwtUserPayload,
        @Body(
            new ValidationPipe(new ZodValidator(ZodRemoveInterestEventsSchema)),
        )
        body: RemoveInterestEventsDto,
    ) {
        return this.removeInterests.execute(user.id, body.eventIds);
    }

    @Get(':eventId')
    @ApiCheckInterestInEvent()
    async checkInterestInEvent(
        @User() user: JwtUserPayload,
        @Param('eventId', ParseIntPipe) eventId: number,
    ) {
        const interested = await this.isInterested.execute(user.id, eventId);
        return { interested };
    }
}
