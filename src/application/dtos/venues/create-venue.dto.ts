import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class InputCreateVenueDto {
    @ApiProperty({
        description: 'Venue name',
        example: 'Central Park Amphitheater',
    })
    name: string;

    @ApiProperty({
        description: 'Venue address',
        example: '123 Main St',
    })
    address: string;

    @ApiProperty({
        description: 'City name',
        example: 'New York',
    })
    city: string;

    @ApiProperty({
        description: 'Latitude coordinate',
        example: 40.7128,
    })
    lat: number;

    @ApiProperty({
        description: 'Longitude coordinate',
        example: -74.006,
    })
    lng: number;

    @ApiPropertyOptional({
        description: 'Venue description',
        example: 'Beautiful outdoor venue with capacity for 5000 people',
    })
    description?: string;

    @ApiPropertyOptional({
        description: 'Contact phone number',
        example: '+1-555-0123',
    })
    phone?: string;

    @ApiPropertyOptional({
        description: 'Venue website URL',
        example: 'https://example.com',
    })
    website?: string;

    @ApiPropertyOptional({
        description: 'Image URL',
        example: 'https://example.com/image.jpg',
    })
    image_url?: string;
}

export class OutputCreateVenueDto {
    @ApiProperty({
        description: 'Venue ID',
        example: 1,
    })
    id: number | bigint;

    @ApiProperty({
        description: 'Venue name',
        example: 'Central Park Amphitheater',
    })
    name: string;
}
