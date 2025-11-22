import { RemoveInterestCategoriesDto } from 'src/application/dtos/user/interests/categories/remove-interest-categories.dto';
import z from 'zod';

export const ZodRemoveInterestCategoriesSchema = z.strictObject({
    categoryIds: z.array(z.number().int().positive()).min(1),
}) as z.ZodType<RemoveInterestCategoriesDto>;
