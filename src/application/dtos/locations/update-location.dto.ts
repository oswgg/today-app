import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { InputCreateLocationDto } from './create-location.dto';

export class InputUpdateLocationDto
    implements Partial<Omit<InputCreateLocationDto, 'lat' | 'lng'>>
{
    @ApiPropertyOptional({
        description: 'Venue name',
        example: 'Updated Venue Name',
    })
    name?: string;

    @ApiPropertyOptional({
        description: 'Venue address',
        example: '456 New St',
    })
    address?: string;

    @ApiPropertyOptional({
        description: 'City name',
        example: 'Boston',
    })
    city?: string;

    @ApiPropertyOptional({
        description: 'Venue description',
        example: 'Updated description',
    })
    description?: string;

    @ApiPropertyOptional({
        description: 'Contact phone number',
        example: '+1-555-9999',
    })
    phone?: string;

    @ApiPropertyOptional({
        description: 'Venue website URL',
        example: 'https://newwebsite.com',
    })
    website?: string;

    @ApiPropertyOptional({
        description: 'Image URL',
        example: 'https://example.com/new-image.jpg',
    })
    image_url?: string;
}

export class OutputUpdateLocationDto {
    @ApiProperty({
        description: 'Venue ID',
        example: 1,
    })
    id: number;

    @ApiProperty({
        description: 'Venue name',
        example: 'Updated Venue Name',
    })
    name: string;
}
