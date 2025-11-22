import { AddInterestLocationsDto } from 'src/application/dtos/user/interests/locations/add-interest-locations.dto';
import z from 'zod';

export const ZodAddInterestLocationsSchema = z.strictObject({
    locationIds: z.array(z.number().int().positive()).min(1),
}) as z.ZodType<AddInterestLocationsDto>;
