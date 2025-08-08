import { InputUpdateVenueDto } from 'src/application/dtos/venues/update-venue.dto';
import z from 'zod';

export const ZodUpdateVenueSchema = z.object({
    name: z.string(),
    lat: z.coerce.number().optional(),
    lng: z.coerce.number().optional(),
    description: z.string().optional(),
    address: z.string().optional(),
    capacity: z.number().optional(),
    image_url: z.string().optional(),
    image: z.string().optional(),
}) as z.ZodType<InputUpdateVenueDto>;
