import { applyDecorators } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiBody, ApiParam } from '@nestjs/swagger';

export const ApiListUserInterestOrganizers = () =>
    applyDecorators(
        ApiOperation({
            summary: 'List user interest organizers',
            description:
                'Get all organizers that the authenticated user is interested in',
        }),
        ApiResponse({
            status: 200,
            description: 'List of organizers retrieved successfully',
            schema: {
                type: 'array',
                items: {
                    type: 'object',
                    properties: {
                        id: { type: 'number', example: 1 },
                        name: { type: 'string', example: 'Event Company Inc' },
                        description: {
                            type: 'string',
                            example: 'Professional event organizer',
                        },
                    },
                },
            },
        }),
        ApiResponse({ status: 401, description: 'Unauthorized' }),
    );

export const ApiAddInterestOrganizers = () =>
    applyDecorators(
        ApiOperation({
            summary: 'Add interest organizers',
            description:
                'Add one or more organizers to user interests. Only existing organizer IDs will be added.',
        }),
        ApiBody({
            description: 'Array of organizer IDs to add',
            schema: {
                type: 'object',
                properties: {
                    organizerIds: {
                        type: 'array',
                        items: { type: 'number' },
                        example: [1, 2, 3],
                    },
                },
            },
        }),
        ApiResponse({
            status: 201,
            description: 'Organizers added successfully',
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
                                organizerId: { type: 'number' },
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

export const ApiRemoveInterestOrganizers = () =>
    applyDecorators(
        ApiOperation({
            summary: 'Remove interest organizers',
            description:
                'Remove one or more organizers from user interests. Only existing organizer IDs will be removed.',
        }),
        ApiBody({
            description: 'Array of organizer IDs to remove',
            schema: {
                type: 'object',
                properties: {
                    organizerIds: {
                        type: 'array',
                        items: { type: 'number' },
                        example: [1, 2, 3],
                    },
                },
            },
        }),
        ApiResponse({
            status: 200,
            description: 'Organizers removed successfully',
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

export const ApiCheckInterestInOrganizer = () =>
    applyDecorators(
        ApiOperation({
            summary: 'Check if user is interested in an organizer',
            description:
                'Verify if the authenticated user has marked interest in a specific organizer',
        }),
        ApiParam({
            name: 'organizerId',
            type: 'number',
            description: 'The ID of the organizer to check',
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
