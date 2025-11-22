import { RemoveInterestLocationsDto } from 'src/application/dtos/user/interests/locations/remove-interest-locations.dto';
import z from 'zod';

export const ZodRemoveInterestLocationsSchema = z.strictObject({
    locationIds: z.array(z.number().int().positive()).min(1),
}) as z.ZodType<RemoveInterestLocationsDto>;
