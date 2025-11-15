import { applyDecorators } from '@nestjs/common';
import {
    ApiOperation,
    ApiResponse,
    ApiParam,
    ApiBearerAuth,
} from '@nestjs/swagger';
import {
    UserResponseDto,
    ErrorResponseDto,
} from 'src/application/dtos/shared/api-response.dto';

export const ApiGetUserById = () =>
    applyDecorators(
        ApiBearerAuth('JWT-auth'),
        ApiOperation({
            summary: 'Get user by ID',
            description: 'Retrieve user information by ID',
        }),
        ApiParam({ name: 'id', type: Number, description: 'User ID' }),
        ApiResponse({
            status: 200,
            description: 'User found',
            type: UserResponseDto,
        }),
        ApiResponse({
            status: 400,
            description: 'Invalid ID',
            type: ErrorResponseDto,
        }),
        ApiResponse({
            status: 401,
            description: 'Unauthorized',
            type: ErrorResponseDto,
        }),
        ApiResponse({
            status: 404,
            description: 'User not found',
            type: ErrorResponseDto,
        }),
    );
