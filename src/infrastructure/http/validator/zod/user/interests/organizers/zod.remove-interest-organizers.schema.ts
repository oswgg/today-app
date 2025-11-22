import { RemoveInterestOrganizersDto } from 'src/application/dtos/user/interests/organizers/remove-interest-organizers.dto';
import z from 'zod';

export const ZodRemoveInterestOrganizersSchema = z.strictObject({
    organizerIds: z.array(z.number().int().positive()).min(1),
}) as z.ZodType<RemoveInterestOrganizersDto>;
