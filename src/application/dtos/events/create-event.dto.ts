import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateEventDto {
    @ApiProperty({
        description: 'Event title',
        example: 'Summer Music Festival',
    })
    title: string;

    @ApiProperty({
        description: 'Event description',
        example: 'A great music festival featuring local bands',
    })
    description: string;

    @ApiProperty({
        description: 'Event start time',
        example: '2025-07-15T18:00:00Z',
        type: String,
    })
    start_time: Date;

    @ApiProperty({
        description: 'Venue ID where the event will take place',
        example: 1,
    })
    venue_id: number;

    @ApiProperty({
        description:
            'Creator ID (automatically filled from authenticated user)',
        example: 1,
    })
    creator_id: number | bigint;

    @ApiPropertyOptional({
        description: 'Event end time',
        example: '2025-07-15T23:00:00Z',
        type: String,
    })
    end_time?: Date;

    @ApiPropertyOptional({
        description: 'Event location address',
        example: '123 Main St, City',
    })
    location?: string;

    @ApiPropertyOptional({
        description: 'Latitude coordinate',
        example: 40.7128,
    })
    lat?: number;

    @ApiPropertyOptional({
        description: 'Longitude coordinate',
        example: -74.006,
    })
    lng?: number;

    @ApiPropertyOptional({
        description: 'Array of category IDs',
        example: [1, 2, 3],
        type: [Number],
    })
    categories?: number[];
}
