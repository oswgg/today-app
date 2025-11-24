import { MfaChallengeDto } from 'src/application/dtos/auth/mfa-challenge.dto';
import z from 'zod';

export const ZodMfaChallenge = z.strictObject({
    factorId: z.string().min(1),
}) as z.ZodType<MfaChallengeDto>;
