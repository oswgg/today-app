import { IsArray, IsNotEmpty, ArrayMinSize, IsNumber } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class AddInterestEventsDto {
    @ApiProperty({
        description: 'Array of event IDs that the user is interested in',
        example: [1, 2, 3],
        type: [Number],
    })
    @IsArray()
    @IsNotEmpty()
    @ArrayMinSize(1)
    @IsNumber({}, { each: true })
    eventIds: number[];
}
