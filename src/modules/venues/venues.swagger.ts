import { applyDecorators } from '@nestjs/common';
import {
    ApiOperation,
    ApiResponse,
    ApiBearerAuth,
    ApiParam,
    ApiBody,
} from '@nestjs/swagger';
import {
    VenueResponseDto,
    ErrorResponseDto,
} from 'src/application/dtos/shared/api-response.dto';
import { InputCreateVenueDto } from 'src/application/dtos/venues/create-venue.dto';
import { InputUpdateVenueDto } from 'src/application/dtos/venues/update-venue.dto';
import { OutputCreateVenueDto } from 'src/application/dtos/venues/create-venue.dto';

export const ApiGetAllVenues = () =>
    applyDecorators(
        ApiOperation({
            summary: 'Get all venues',
            description: 'List all venues',
        }),
        ApiResponse({
            status: 200,
            description: 'List of venues',
            type: [VenueResponseDto],
        }),
    );

export const ApiCreateVenue = () =>
    applyDecorators(
        ApiBearerAuth('JWT-auth'),
        ApiOperation({
            summary: 'Create venue',
            description: 'Create a new venue (Organizer only)',
        }),
        ApiBody({ type: InputCreateVenueDto }),
        ApiResponse({
            status: 201,
            description: 'Venue created successfully',
            type: OutputCreateVenueDto,
        }),
        ApiResponse({
            status: 401,
            description: 'Unauthorized',
            type: ErrorResponseDto,
        }),
        ApiResponse({
            status: 403,
            description:
                'Forbidden - Organizer role required or venue already exists',
            type: ErrorResponseDto,
        }),
    );

export const ApiUpdateVenue = () =>
    applyDecorators(
        ApiBearerAuth('JWT-auth'),
        ApiOperation({
            summary: 'Update venue',
            description: 'Update an existing venue (Owner only)',
        }),
        ApiParam({ name: 'id', type: Number, description: 'Venue ID' }),
        ApiBody({ type: InputUpdateVenueDto }),
        ApiResponse({
            status: 200,
            description: 'Venue updated successfully',
            type: VenueResponseDto,
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
            description: 'Venue not found',
            type: ErrorResponseDto,
        }),
    );

export const ApiDeleteVenue = () =>
    applyDecorators(
        ApiBearerAuth('JWT-auth'),
        ApiOperation({
            summary: 'Delete venue',
            description: 'Delete a venue (Owner only)',
        }),
        ApiParam({ name: 'id', type: Number, description: 'Venue ID' }),
        ApiResponse({ status: 204, description: 'Venue deleted successfully' }),
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
            description: 'Venue not found',
            type: ErrorResponseDto,
        }),
    );
