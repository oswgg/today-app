import { InputCreateLocationDto } from 'src/application/dtos/locations/create-location.dto';
import z from 'zod';

export const ZodCreateLocationSchema = z.strictObject({
    name: z.string(),
    address: z.string(),
    city: z.string(),
    lat: z.coerce.number(),
    lng: z.coerce.number(),
    description: z.string().optional(),
    phone: z.string().optional(),
    website: z.string().optional(),
    image_url: z.string().optional(),
}) as z.ZodType<InputCreateLocationDto>;
