import { AddInterestEventsDto } from 'src/application/dtos/user/interests/events/add-interest-events.dto';
import z from 'zod';

export const ZodAddInterestEventsSchema = z.strictObject({
    eventIds: z.array(z.number().int().positive()).min(1),
}) as z.ZodType<AddInterestEventsDto>;
