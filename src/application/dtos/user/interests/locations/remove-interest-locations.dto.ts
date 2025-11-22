import { IsArray, IsNotEmpty, ArrayMinSize, IsNumber } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class RemoveInterestLocationsDto {
    @ApiProperty({
        description: 'Array of location IDs to remove from user interests',
        example: [1, 2, 3],
        type: [Number],
    })
    @IsArray()
    @IsNotEmpty()
    @ArrayMinSize(1)
    @IsNumber({}, { each: true })
    locationIds: number[];
}
