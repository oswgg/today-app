import { applyDecorators } from '@nestjs/common';
import {
    ApiOperation,
    ApiResponse,
    ApiQuery,
    ApiBearerAuth,
    ApiBody,
    ApiParam,
} from '@nestjs/swagger';
import {
    EventResponseDto,
    CategoryResponseDto,
    ErrorResponseDto,
} from 'src/application/dtos/shared/api-response.dto';
import { CreateEventDto } from 'src/application/dtos/events/create-event.dto';

export const ApiGetAllEvents = () =>
    applyDecorators(
        ApiOperation({
            summary: 'Get all events',
            description:
                'List all public events with optional location-based filtering',
        }),
        ApiQuery({
            name: 'lat',
            required: false,
            type: Number,
            description: 'Latitude for location-based search',
        }),
        ApiQuery({
            name: 'lng',
            required: false,
            type: Number,
            description: 'Longitude for location-based search',
        }),
        ApiQuery({
            name: 'radius',
            required: false,
            type: Number,
            description: 'Search radius in kilometers',
        }),
        ApiResponse({
            status: 200,
            description: 'List of events',
            type: [EventResponseDto],
        }),
    );

export const ApiGetAllCategories = () =>
    applyDecorators(
        ApiOperation({
            summary: 'Get all categories',
            description: 'List all available event categories',
        }),
        ApiResponse({
            status: 200,
            description: 'List of categories',
            type: [CategoryResponseDto],
        }),
    );

export const ApiGetEventById = () =>
    applyDecorators(
        ApiOperation({
            summary: 'Get event by ID',
            description: 'Get detailed information about a specific event',
        }),
        ApiParam({ name: 'id', type: Number, description: 'Event ID' }),
        ApiResponse({
            status: 200,
            description: 'Event details',
            type: EventResponseDto,
        }),
        ApiResponse({
            status: 404,
            description: 'Event not found',
            type: ErrorResponseDto,
        }),
    );

export const ApiCreateEvent = () =>
    applyDecorators(
        ApiBearerAuth('JWT-auth'),
        ApiOperation({
            summary: 'Create event',
            description: 'Create a new event (Organizer/Institution only)',
        }),
        ApiBody({ type: CreateEventDto }),
        ApiResponse({
            status: 201,
            description: 'Event created successfully',
            type: EventResponseDto,
        }),
        ApiResponse({
            status: 401,
            description: 'Unauthorized',
            type: ErrorResponseDto,
        }),
        ApiResponse({
            status: 403,
            description: 'Forbidden - Organizer/Institution role required',
            type: ErrorResponseDto,
        }),
    );
