import { applyDecorators } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiBody, ApiParam } from '@nestjs/swagger';

export const ApiListUserInterestEvents = () =>
    applyDecorators(
        ApiOperation({
            summary: 'List user interest events',
            description:
                'Get all events that the authenticated user is interested in',
        }),
        ApiResponse({
            status: 200,
            description: 'List of events retrieved successfully',
            schema: {
                type: 'array',
                items: {
                    type: 'object',
                    properties: {
                        id: { type: 'number', example: 1 },
                        name: { type: 'string', example: 'Summer Festival' },
                        description: {
                            type: 'string',
                            example: 'Annual music festival',
                        },
                        startDate: { type: 'string', format: 'date-time' },
                        endDate: { type: 'string', format: 'date-time' },
                    },
                },
            },
        }),
        ApiResponse({ status: 401, description: 'Unauthorized' }),
    );

export const ApiAddInterestEvents = () =>
    applyDecorators(
        ApiOperation({
            summary: 'Add interest events',
            description:
                'Add one or more events to user interests. Only existing event IDs will be added.',
        }),
        ApiBody({
            description: 'Array of event IDs to add',
            schema: {
                type: 'object',
                properties: {
                    eventIds: {
                        type: 'array',
                        items: { type: 'number' },
                        example: [1, 2, 3],
                    },
                },
            },
        }),
        ApiResponse({
            status: 201,
            description: 'Events added successfully',
            schema: {
                type: 'object',
                properties: {
                    added: {
                        type: 'array',
                        items: {
                            type: 'object',
                            properties: {
                                id: { type: 'number' },
                                userId: { type: 'number' },
                                eventId: { type: 'number' },
                                createdAt: {
                                    type: 'string',
                                    format: 'date-time',
                                },
                            },
                        },
                    },
                    notFound: {
                        type: 'array',
                        items: { type: 'number' },
                        description: 'IDs that do not exist in the database',
                    },
                },
            },
        }),
        ApiResponse({
            status: 400,
            description: 'Bad request - Invalid input',
        }),
        ApiResponse({ status: 401, description: 'Unauthorized' }),
    );

export const ApiRemoveInterestEvents = () =>
    applyDecorators(
        ApiOperation({
            summary: 'Remove interest events',
            description:
                'Remove one or more events from user interests. Only existing event IDs will be removed.',
        }),
        ApiBody({
            description: 'Array of event IDs to remove',
            schema: {
                type: 'object',
                properties: {
                    eventIds: {
                        type: 'array',
                        items: { type: 'number' },
                        example: [1, 2, 3],
                    },
                },
            },
        }),
        ApiResponse({
            status: 200,
            description: 'Events removed successfully',
            schema: {
                type: 'object',
                properties: {
                    removed: {
                        type: 'array',
                        items: { type: 'number' },
                        description: 'IDs that were successfully removed',
                    },
                    notFound: {
                        type: 'array',
                        items: { type: 'number' },
                        description: 'IDs that do not exist in the database',
                    },
                },
            },
        }),
        ApiResponse({
            status: 400,
            description: 'Bad request - Invalid input',
        }),
        ApiResponse({ status: 401, description: 'Unauthorized' }),
    );

export const ApiCheckInterestInEvent = () =>
    applyDecorators(
        ApiOperation({
            summary: 'Check if user is interested in an event',
            description:
                'Verify if the authenticated user has marked interest in a specific event',
        }),
        ApiParam({
            name: 'eventId',
            type: 'number',
            description: 'The ID of the event to check',
            example: 1,
        }),
        ApiResponse({
            status: 200,
            description: 'Interest status retrieved successfully',
            schema: {
                type: 'object',
                properties: {
                    interested: { type: 'boolean', example: true },
                },
            },
        }),
        ApiResponse({ status: 401, description: 'Unauthorized' }),
    );
