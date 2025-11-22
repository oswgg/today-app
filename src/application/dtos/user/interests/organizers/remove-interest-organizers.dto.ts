import { IsArray, IsNotEmpty, ArrayMinSize, IsNumber } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class RemoveInterestOrganizersDto {
    @ApiProperty({
        description: 'Array of organizer IDs to remove from user interests',
        example: [1, 2, 3],
        type: [Number],
    })
    @IsArray()
    @IsNotEmpty()
    @ArrayMinSize(1)
    @IsNumber({}, { each: true })
    organizerIds: number[];
}
