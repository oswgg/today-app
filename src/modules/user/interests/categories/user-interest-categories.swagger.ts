import { applyDecorators } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiBody, ApiParam } from '@nestjs/swagger';

export const ApiListUserInterestCategories = () =>
    applyDecorators(
        ApiOperation({
            summary: 'List user interest categories',
            description:
                'Get all categories that the authenticated user is interested in',
        }),
        ApiResponse({
            status: 200,
            description: 'List of categories retrieved successfully',
            schema: {
                type: 'array',
                items: {
                    type: 'object',
                    properties: {
                        id: { type: 'number', example: 1 },
                        name: { type: 'string', example: 'Music' },
                        icon: { type: 'string', example: '🎵' },
                    },
                },
            },
        }),
        ApiResponse({ status: 401, description: 'Unauthorized' }),
    );

export const ApiAddInterestCategories = () =>
    applyDecorators(
        ApiOperation({
            summary: 'Add interest categories',
            description:
                'Add one or more categories to user interests. Only existing category IDs will be added.',
        }),
        ApiBody({
            description: 'Array of category IDs to add',
            schema: {
                type: 'object',
                properties: {
                    categoryIds: {
                        type: 'array',
                        items: { type: 'number' },
                        example: [1, 2, 3],
                    },
                },
            },
        }),
        ApiResponse({
            status: 201,
            description: 'Categories added successfully',
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
                                categoryId: { type: 'number' },
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

export const ApiRemoveInterestCategories = () =>
    applyDecorators(
        ApiOperation({
            summary: 'Remove interest categories',
            description:
                'Remove one or more categories from user interests. Only existing category IDs will be removed.',
        }),
        ApiBody({
            description: 'Array of category IDs to remove',
            schema: {
                type: 'object',
                properties: {
                    categoryIds: {
                        type: 'array',
                        items: { type: 'number' },
                        example: [1, 2, 3],
                    },
                },
            },
        }),
        ApiResponse({
            status: 200,
            description: 'Categories removed successfully',
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

export const ApiCheckInterestInCategory = () =>
    applyDecorators(
        ApiOperation({
            summary: 'Check if user is interested in a category',
            description:
                'Verify if the authenticated user has marked interest in a specific category',
        }),
        ApiParam({
            name: 'categoryId',
            type: 'number',
            description: 'The ID of the category to check',
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
