import { applyDecorators } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiBody, ApiParam } from '@nestjs/swagger';

export const ApiListUserInterestLocations = () =>
    applyDecorators(
        ApiOperation({
            summary: 'List user interest locations',
            description:
                'Get all locations that the authenticated user is interested in',
        }),
        ApiResponse({
            status: 200,
            description: 'List of locations retrieved successfully',
            schema: {
                type: 'array',
                items: {
                    type: 'object',
                    properties: {
                        id: { type: 'number', example: 1 },
                        name: { type: 'string', example: 'Central Park' },
                        address: { type: 'string', example: '123 Main St' },
                        city: { type: 'string', example: 'New York' },
                        lat: { type: 'number', example: 40.7128 },
                        lng: { type: 'number', example: -74.006 },
                    },
                },
            },
        }),
        ApiResponse({ status: 401, description: 'Unauthorized' }),
    );

export const ApiAddInterestLocations = () =>
    applyDecorators(
        ApiOperation({
            summary: 'Add interest locations',
            description:
                'Add one or more locations to user interests. Only existing location IDs will be added.',
        }),
        ApiBody({
            description: 'Array of location IDs to add',
            schema: {
                type: 'object',
                properties: {
                    locationIds: {
                        type: 'array',
                        items: { type: 'number' },
                        example: [1, 2, 3],
                    },
                },
            },
        }),
        ApiResponse({
            status: 201,
            description: 'Locations added successfully',
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
                                locationId: { type: 'number' },
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

export const ApiRemoveInterestLocations = () =>
    applyDecorators(
        ApiOperation({
            summary: 'Remove interest locations',
            description:
                'Remove one or more locations from user interests. Only existing location IDs will be removed.',
        }),
        ApiBody({
            description: 'Array of location IDs to remove',
            schema: {
                type: 'object',
                properties: {
                    locationIds: {
                        type: 'array',
                        items: { type: 'number' },
                        example: [1, 2, 3],
                    },
                },
            },
        }),
        ApiResponse({
            status: 200,
            description: 'Locations removed successfully',
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

export const ApiCheckInterestInLocation = () =>
    applyDecorators(
        ApiOperation({
            summary: 'Check if user is interested in a location',
            description:
                'Verify if the authenticated user has marked interest in a specific location',
        }),
        ApiParam({
            name: 'locationId',
            type: 'number',
            description: 'The ID of the location to check',
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
