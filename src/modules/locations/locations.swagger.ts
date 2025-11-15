import { applyDecorators } from '@nestjs/common';
import {
    ApiOperation,
    ApiResponse,
    ApiBearerAuth,
    ApiParam,
    ApiBody,
} from '@nestjs/swagger';
import {
    ErrorResponseDto,
    LocationResponseDto,
} from 'src/application/dtos/shared/api-response.dto';
import { InputCreateLocationDto } from 'src/application/dtos/locations/create-location.dto';
import { InputUpdateLocationDto } from 'src/application/dtos/locations/update-location.dto';
import { OutputCreateLocationDto } from 'src/application/dtos/locations/create-location.dto';

export const ApiGetAllLocations = () =>
    applyDecorators(
        ApiOperation({
            summary: 'Get all locations',
            description: 'List all locations',
        }),
        ApiResponse({
            status: 200,
            description: 'List of locations',
            type: [LocationResponseDto],
        }),
    );

export const ApiCreateLocation = () =>
    applyDecorators(
        ApiBearerAuth('JWT-auth'),
        ApiOperation({
            summary: 'Create location',
            description: 'Create a new location (Organizer only)',
        }),
        ApiBody({ type: InputCreateLocationDto }),
        ApiResponse({
            status: 201,
            description: 'location created successfully',
            type: OutputCreateLocationDto,
        }),
        ApiResponse({
            status: 401,
            description: 'Unauthorized',
            type: ErrorResponseDto,
        }),
        ApiResponse({
            status: 403,
            description:
                'Forbidden - Organizer role required or location already exists',
            type: ErrorResponseDto,
        }),
    );

export const ApiUpdateLocation = () =>
    applyDecorators(
        ApiBearerAuth('JWT-auth'),
        ApiOperation({
            summary: 'Update location',
            description: 'Update an existing location (Owner only)',
        }),
        ApiParam({ name: 'id', type: Number, description: 'location ID' }),
        ApiBody({ type: InputUpdateLocationDto }),
        ApiResponse({
            status: 200,
            description: 'location updated successfully',
            type: LocationResponseDto,
        }),
        ApiResponse({
            status: 401,
            description: 'Unauthorized',
            type: ErrorResponseDto,
        }),
        ApiResponse({
            status: 403,
            description: 'Forbidden - Not the owner',
            type: ErrorResponseDto,
        }),
        ApiResponse({
            status: 404,
            description: 'location not found',
            type: ErrorResponseDto,
        }),
    );

export const ApiDeleteLocation = () =>
    applyDecorators(
        ApiBearerAuth('JWT-auth'),
        ApiOperation({
            summary: 'Delete location',
            description: 'Delete a location (Owner only)',
        }),
        ApiParam({ name: 'id', type: Number, description: 'location ID' }),
        ApiResponse({
            status: 204,
            description: 'location deleted successfully',
        }),
        ApiResponse({
            status: 401,
            description: 'Unauthorized',
            type: ErrorResponseDto,
        }),
        ApiResponse({
            status: 403,
            description: 'Forbidden - Not the owner',
            type: ErrorResponseDto,
        }),
        ApiResponse({
            status: 404,
            description: 'location not found',
            type: ErrorResponseDto,
        }),
    );
