import { InputUpdateLocationDto } from 'src/application/dtos/locations/update-location.dto';
import z from 'zod';

export const ZodUpdateLocationSchema = z.object({
    name: z.string(),
    lat: z.coerce.number().optional(),
    lng: z.coerce.number().optional(),
    description: z.string().optional(),
    address: z.string().optional(),
    capacity: z.number().optional(),
    image_url: z.string().optional(),
    image: z.string().optional(),
}) as z.ZodType<InputUpdateLocationDto>;
