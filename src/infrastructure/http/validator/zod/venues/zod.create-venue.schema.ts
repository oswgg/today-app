import { InputCreateVenueDto } from 'src/application/dtos/venues/create-venue.dto';
import z from 'zod';

export const ZodCreateVenueSchema = z.strictObject({
    name: z.string(),
    address: z.string(),
    city: z.string(),
    lat: z.number(),
    lng: z.number(),
    description: z.string().optional(),
    phone: z.string().optional(),
    website: z.string().optional(),
    image_url: z.string().optional(),
}) as z.ZodType<InputCreateVenueDto>;
