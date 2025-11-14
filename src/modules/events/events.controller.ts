import { Body, Controller, Get, Post, Query, UseGuards } from '@nestjs/common';
import { CreateEventDto } from 'src/application/dtos/events/create-event.dto';
import { CreateEvent } from 'src/application/use-cases/events/create-event.usecase';
import { ListAllEvents } from 'src/application/use-cases/events/list-all-events.usecase';
import { EventEntity } from 'src/domain/entities/event.entity';
import { OrganizerGuard } from '../shared/guards/organizer-role.guard';
import { ValidationPipe } from '../shared/pipes/validation.pipe';
import { ZodValidator } from 'src/infrastructure/http/validator/zod/zod.validator';
import { ZodCreateEvent } from 'src/infrastructure/http/validator/zod/events/zod.create-event.schema';
import { CategoryEntity } from 'src/domain/entities/category.entity';
import { ListAvailableCategories } from 'src/application/use-cases/events/list-available-categories.usecase';
import { Public } from '../shared/decorators/public.decorator';
import { User } from '../shared/decorators/user.decorator';
import { JwtUserPayload } from 'src/domain/entities/jwt-payload.entity';

@Controller('events')
export class EventsController {
    constructor(
        private readonly listEvents: ListAllEvents,
        private readonly createEvent: CreateEvent,
        private readonly listCategories: ListAvailableCategories,
    ) {}

    @Get('/')
    @Public()
    async getAllEvents(
        @Query('lat', { transform: (v: string) => parseFloat(v) }) lat?: number,
        @Query('lng', { transform: (v: string) => parseFloat(v) }) lng?: number,
        @Query('radius', { transform: (v: string) => parseFloat(v) })
        radius?: number,
    ): Promise<EventEntity[]> {
        return await this.listEvents.execute(lat, lng, radius);
    }

    @Get('/categories')
    @Public()
    async getAllAvailableCategories(): Promise<CategoryEntity[]> {
        return await this.listCategories.execute();
    }

    @UseGuards(OrganizerGuard)
    @Post('/')
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
