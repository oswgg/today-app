import { IsArray, IsNotEmpty, ArrayMinSize, IsNumber } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class AddInterestLocationsDto {
    @ApiProperty({
        description: 'Array of location IDs that the user is interested in',
        example: [1, 2, 3],
        type: [Number],
    })
    @IsArray()
    @IsNotEmpty()
    @ArrayMinSize(1)
    @IsNumber({}, { each: true })
    locationIds: number[];
}
