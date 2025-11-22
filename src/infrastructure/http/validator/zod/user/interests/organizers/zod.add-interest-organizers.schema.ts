import { AddInterestOrganizersDto } from 'src/application/dtos/user/interests/organizers/add-interest-organizers.dto';
import z from 'zod';

export const ZodAddInterestOrganizersSchema = z.strictObject({
    organizerIds: z.array(z.number().int().positive()).min(1),
}) as z.ZodType<AddInterestOrganizersDto>;
