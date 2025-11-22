import { AddInterestCategoriesDto } from 'src/application/dtos/user/interests/categories/add-interest-categories.dto';
import z from 'zod';

export const ZodAddInterestCategoriesSchema = z.strictObject({
    categoryIds: z.array(z.number().int().positive()).min(1),
}) as z.ZodType<AddInterestCategoriesDto>;
