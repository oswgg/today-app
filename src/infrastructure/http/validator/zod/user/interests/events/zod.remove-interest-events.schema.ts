import { RemoveInterestEventsDto } from 'src/application/dtos/user/interests/events/remove-interest-events.dto';
import z from 'zod';

export const ZodRemoveInterestEventsSchema = z.strictObject({
    eventIds: z.array(z.number().int().positive()).min(1),
}) as z.ZodType<RemoveInterestEventsDto>;
