import { Body, Controller, Get, Post } from '@nestjs/common';
import { CreateEventDto } from 'src/application/dtos/events/create-event.dto';
import { CreateEvent } from 'src/application/use-cases/events/create-event.usecase';
import { ListAllEvents } from 'src/application/use-cases/events/list-all-events.usecase';
import { EventEntity } from 'src/domain/entities/event.entity';

@Controller('events')
export class EventsController {
    constructor(
        private readonly listEvents: ListAllEvents,
        private readonly createEvent: CreateEvent,
    ) {}

    @Get('/')
    async listAll() {
        return await this.listEvents.execute();
    }

    @Post('/')
    async create(@Body() body: CreateEventDto): Promise<EventEntity> {
        const info: CreateEventDto = {
            title: body.title,
            description: body.description,
            start_time: new Date(body.start_time),
            end_time: body.end_time && new Date(body.end_time),
            location: body.location,
        };

        return await this.createEvent.execute(info);
    }
}
