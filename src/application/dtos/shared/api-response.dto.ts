import { ApiProperty } from '@nestjs/swagger';

export class LoginResponseDto {
    @ApiProperty({
        description: 'JWT access token',
        example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
    })
    token: string;

    @ApiProperty({
        description: 'User information',
        example: {
            id: 1,
            email: 'user@example.com',
            name: 'John Doe',
            role: 'USER',
        },
    })
    user: {
        id: number;
        email: string;
        name: string;
        role: string;
    };
}

export class UserResponseDto {
    @ApiProperty({ description: 'User ID', example: 1 })
    id: number;

    @ApiProperty({ description: 'User email', example: 'user@example.com' })
    email: string;

    @ApiProperty({ description: 'User name', example: 'John Doe' })
    name: string;

    @ApiProperty({
        description: 'User role',
        enum: ['USER', 'ORGANIZER', 'INSTITUTION'],
        example: 'USER',
    })
    role: string;

    @ApiProperty({
        description: 'Account creation date',
        example: '2025-01-15T10:30:00Z',
    })
    createdAt: Date;

    @ApiProperty({
        description: 'OAuth provider UID',
        example: 'google_123456789',
        nullable: true,
    })
    uid: string | null;
}

export class EventResponseDto {
    @ApiProperty({ description: 'Event ID', example: 1 })
    id: number;

    @ApiProperty({
        description: 'Event title',
        example: 'Summer Music Festival',
    })
    title: string;

    @ApiProperty({
        description: 'Event description',
        example: 'A great music festival',
        nullable: true,
    })
    description: string | null;

    @ApiProperty({
        description: 'Event start time',
        example: '2025-07-15T18:00:00Z',
    })
    start_time: Date;

    @ApiProperty({
        description: 'Event end time',
        example: '2025-07-15T23:00:00Z',
        nullable: true,
    })
    end_time: Date | null;

    @ApiProperty({ description: 'Creator ID', example: 1 })
    creator_id: number;

    @ApiProperty({
        description: 'Venue ID',
        example: 1,
        nullable: true,
    })
    venue_id: number | null;

    @ApiProperty({
        description: 'Location address',
        example: '123 Main St',
        nullable: true,
    })
    location: string | null;

    @ApiProperty({
        description: 'Latitude',
        example: 40.7128,
        nullable: true,
    })
    lat: number | null;

    @ApiProperty({
        description: 'Longitude',
        example: -74.006,
        nullable: true,
    })
    lng: number | null;

    @ApiProperty({
        description: 'Image URL',
        example: 'https://example.com/image.jpg',
        nullable: true,
    })
    image_url: string | null;

    @ApiProperty({
        description: 'Creation date',
        example: '2025-01-15T10:30:00Z',
    })
    created_at: Date;
}

export class CategoryResponseDto {
    @ApiProperty({ description: 'Category ID', example: 1 })
    id: number;

    @ApiProperty({ description: 'Category name', example: 'Music' })
    name: string;

    @ApiProperty({
        description: 'Category description',
        example: 'Music events',
        nullable: true,
    })
    description: string | null;
}

export class VenueResponseDto {
    @ApiProperty({ description: 'Venue ID', example: 1 })
    id: number;

    @ApiProperty({
        description: 'Venue name',
        example: 'Central Park Amphitheater',
    })
    name: string;

    @ApiProperty({ description: 'Address', example: '123 Main St' })
    address: string;

    @ApiProperty({ description: 'City', example: 'New York' })
    city: string;

    @ApiProperty({ description: 'Latitude', example: 40.7128 })
    lat: number;

    @ApiProperty({ description: 'Longitude', example: -74.006 })
    lng: number;

    @ApiProperty({
        description: 'Description',
        example: 'Beautiful outdoor venue',
        nullable: true,
    })
    description: string | null;

    @ApiProperty({
        description: 'Phone',
        example: '+1-555-0123',
        nullable: true,
    })
    phone: string | null;

    @ApiProperty({
        description: 'Website',
        example: 'https://example.com',
        nullable: true,
    })
    website: string | null;

    @ApiProperty({ description: 'Creator ID', example: 1 })
    creator_id: number;

    @ApiProperty({
        description: 'Creation date',
        example: '2025-01-15T10:30:00Z',
    })
    created_at: Date;
}

export class ErrorResponseDto {
    @ApiProperty({
        description: 'HTTP status code',
        example: 400,
    })
    statusCode: number;

    @ApiProperty({
        description: 'Error message',
        example: 'Bad Request',
    })
    message: string;

    @ApiProperty({
        description: 'Error details',
        example: 'Invalid input data',
        required: false,
    })
    error?: string;
}
