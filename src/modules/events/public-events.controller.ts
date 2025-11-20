import { Controller, Get, Param, ParseIntPipe, Query } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import {
    ApiGetAllEvents,
    ApiGetAllCategories,
    ApiGetEventById,
} from './events.swagger';
import { ListAllEvents } from 'src/application/use-cases/events/list-all-events.usecase';
import { GetEventById } from 'src/application/use-cases/events/get-event-by-id.usecase';
import { type EventEntity } from 'src/domain/entities/event.entity';
import { CategoryEntity } from 'src/domain/entities/category.entity';
import { ListAvailableCategories } from 'src/application/use-cases/events/list-available-categories.usecase';
import { Public } from '../shared/decorators/public.decorator';
import { QueryFilter } from '../shared/decorators/query-filter.decorator';
import { QueryOptions } from 'src/application/dtos/shared/query-options.dto';

@ApiTags('Events (Public)')
@Controller('events')
export class PublicEventsController {
    constructor(
        private readonly listEvents: ListAllEvents,
        private readonly getEventById: GetEventById,
        private readonly listCategories: ListAvailableCategories,
    ) {}

    @Get('/')
    @Public()
    @ApiGetAllEvents()
    async getAllEvents(
        @Query('lat', { transform: (v: string) => parseFloat(v) }) lat?: number,
        @Query('lng', { transform: (v: string) => parseFloat(v) }) lng?: number,
        @Query('radius', {
            transform: (v: string) => parseFloat(v) || undefined,
        })
        radius?: number,
        @QueryFilter<EventEntity>([
            'creator_id',
            'start_time',
            'title',
            'categories',
            'creator',
        ])
        filters?: QueryOptions<EventEntity>,
    ): Promise<EventEntity[]> {
        return await this.listEvents.execute({ lat, lng, radius, filters });
    }

    @Get('/categories')
    @Public()
    @ApiGetAllCategories()
    async getAllAvailableCategories(): Promise<CategoryEntity[]> {
        return await this.listCategories.execute();
    }

    @Get('/:id')
    @Public()
    @ApiGetEventById()
    async getEventDetails(
        @Param('id', ParseIntPipe) id: number,
    ): Promise<EventEntity> {
        return await this.getEventById.execute(id);
    }
}
