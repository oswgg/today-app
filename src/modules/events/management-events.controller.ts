import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { ApiCreateEvent } from './events.swagger';
import { CreateEventDto } from 'src/application/dtos/events/create-event.dto';
import { CreateEvent } from 'src/application/use-cases/events/create-event.usecase';
import { type EventEntity } from 'src/domain/entities/event.entity';
import { ValidationPipe } from '../shared/pipes/validation.pipe';
import { ZodValidator } from 'src/infrastructure/http/validator/zod/zod.validator';
import { ZodCreateEvent } from 'src/infrastructure/http/validator/zod/events/zod.create-event.schema';
import { User } from '../shared/decorators/user.decorator';
import { JwtUserPayload } from 'src/domain/entities/jwt-payload.entity';
import { UserRoleGuard } from '../shared/guards/user-role.guard';
import { RequiredRole } from '../shared/decorators/required-user-role.decorator';
import { UserRole } from 'src/domain/types/user-role.enum';

@ApiTags('Events (Management)')
@ApiBearerAuth('JWT-auth')
@Controller('events/management')
@UseGuards(UserRoleGuard)
@RequiredRole([UserRole.ORGANIZER, UserRole.INSTITUTION])
export class ManagementEventsController {
    constructor(private readonly createEvent: CreateEvent) {}

    @Post('/')
    @ApiCreateEvent()
    async create(
        @Body(new ValidationPipe(new ZodValidator(ZodCreateEvent)))
        body: CreateEventDto,
        @User() user: JwtUserPayload,
    ): Promise<EventEntity> {
        return await this.createEvent.execute({
            ...body,
            creator_id: user.id,
        });
    }
}
