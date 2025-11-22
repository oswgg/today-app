import { IsArray, IsNotEmpty, ArrayMinSize, IsNumber } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class RemoveInterestEventsDto {
    @ApiProperty({
        description: 'Array of event IDs to remove from user interests',
        example: [1, 2, 3],
        type: [Number],
    })
    @IsArray()
    @IsNotEmpty()
    @ArrayMinSize(1)
    @IsNumber({}, { each: true })
    eventIds: number[];
}
