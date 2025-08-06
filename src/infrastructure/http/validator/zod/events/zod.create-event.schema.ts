import { CreateEventDto } from 'src/application/dtos/events/create-event.dto';
import { z } from 'zod';

export const ZodCreateEvent = z.strictObject({
    title: z.string().min(3).max(100),
    description: z.string().min(10).max(1000),
    start_time: z.coerce.date(),
    organizer_id: z.number().int(),
    end_time: z.optional(z.coerce.date()),
    location: z.string().optional(),
    lat: z.optional(z.number()),
    lng: z.optional(z.number()),
    categories: z.array(z.number().int()).optional(),
}) as z.ZodType<CreateEventDto>;
