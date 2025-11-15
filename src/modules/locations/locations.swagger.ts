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
            description: 'List all public locations',
        }),
        ApiResponse({
            status: 200,
            description: 'List of locations',
            type: [LocationResponseDto],
        }),
    );

export const ApiGetLocationById = () =>
    applyDecorators(
        ApiOperation({
            summary: 'Get location by ID',
            description: 'Get detailed information about a specific location',
        }),
        ApiParam({ name: 'id', type: Number, description: 'Location ID' }),
        ApiResponse({
            status: 200,
            description: 'Location details',
            type: LocationResponseDto,
        }),
        ApiResponse({
            status: 404,
            description: 'Location not found',
            type: ErrorResponseDto,
        }),
    );

export const ApiGetMyLocations = () =>
    applyDecorators(
        ApiBearerAuth('JWT-auth'),
        ApiOperation({
            summary: 'Get my locations',
            description:
                'List all locations owned by the authenticated organizer/institution',
        }),
        ApiResponse({
            status: 200,
            description: 'List of owned locations',
            type: [LocationResponseDto],
        }),
        ApiResponse({
            status: 401,
            description: 'Unauthorized',
            type: ErrorResponseDto,
        }),
        ApiResponse({
            status: 403,
            description: 'Forbidden - Organizer or Institution role required',
            type: ErrorResponseDto,
        }),
    );

export const ApiCreateLocation = () =>
    applyDecorators(
        ApiBearerAuth('JWT-auth'),
        ApiOperation({
            summary: 'Create location',
            description: 'Create a new location (Organizer/Institution only)',
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
                'Forbidden - Organizer/Institution role required or location already exists',
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
