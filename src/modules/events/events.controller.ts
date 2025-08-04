import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { Request } from 'express';
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
    async getAllEvents(
        @Query('lat', { transform: (v: string) => parseFloat(v) }) lat?: number,
        @Query('lng', { transform: (v: string) => parseFloat(v) }) lng?: number,
        @Query('radius', { transform: (v: string) => parseFloat(v) })
        radius?: number,
    ): Promise<EventEntity[]> {
        return await this.listEvents.execute(lat, lng, radius);
    }

    @Post('/')
    async create(@Body() body: CreateEventDto): Promise<EventEntity> {
        const info: CreateEventDto = {
            title: body.title,
            description: body.description,
            start_time: new Date(body.start_time),
            end_time: body.end_time && new Date(body.end_time),
            organizer_id: 1,
            lat: body.lat,
            lng: body.lng,
            location: body.location,
            categories: body.categories,
        };

        return await this.createEvent.execute(info);
    }
}
