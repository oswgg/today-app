import { IsArray, IsNotEmpty, ArrayMinSize, IsNumber } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class RemoveInterestCategoriesDto {
    @ApiProperty({
        description: 'Array of category IDs to remove from user interests',
        example: [1, 2],
        type: [Number],
    })
    @IsArray()
    @IsNotEmpty()
    @ArrayMinSize(1)
    @IsNumber({}, { each: true })
    categoryIds: number[];
}
