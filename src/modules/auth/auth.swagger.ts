import { applyDecorators } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiBody } from '@nestjs/swagger';
import {
    LoginResponseDto,
    UserResponseDto,
    ErrorResponseDto,
} from 'src/application/dtos/shared/api-response.dto';
import { RegisterWithOAuthDto } from 'src/application/dtos/auth/register-with-oauth.dto';
import { LoginWitOAuthDto } from 'src/application/dtos/auth/login-with-oaut.dto';
import { LoginWithPasswordDto } from 'src/application/dtos/auth/login-with-password.dto';

export const ApiRegisterWithOAuth = () =>
    applyDecorators(
        ApiOperation({
            summary: 'Register with OAuth',
            description: 'Register a new user or organizer using OAuth token',
        }),
        ApiBody({ type: RegisterWithOAuthDto }),
        ApiResponse({
            status: 201,
            description: 'User registered successfully',
            type: UserResponseDto,
        }),
        ApiResponse({
            status: 400,
            description: 'Bad request - Invalid token or user type',
            type: ErrorResponseDto,
        }),
    );

export const ApiLoginWithPassword = () =>
    applyDecorators(
        ApiOperation({
            summary: 'Login with password',
            description: 'Authenticate user with email and password',
        }),
        ApiBody({ type: LoginWithPasswordDto }),
        ApiResponse({
            status: 200,
            description: 'Login successful',
            type: LoginResponseDto,
        }),
        ApiResponse({
            status: 401,
            description: 'Invalid credentials',
            type: ErrorResponseDto,
        }),
    );

export const ApiLoginWithOAuth = () =>
    applyDecorators(
        ApiOperation({
            summary: 'Login with OAuth',
            description: 'Authenticate user with OAuth token',
        }),
        ApiBody({ type: LoginWitOAuthDto }),
        ApiResponse({
            status: 200,
            description: 'Login successful',
            type: LoginResponseDto,
        }),
        ApiResponse({
            status: 400,
            description: 'Invalid token',
            type: ErrorResponseDto,
        }),
        ApiResponse({
            status: 404,
            description: 'User not found',
            type: ErrorResponseDto,
        }),
    );
