import { MfaVerifyDto } from 'src/application/dtos/auth/mfa-verify.dto';
import z from 'zod';

export const ZodMfaVerify = z.strictObject({
    factorId: z.string().min(1),
    code: z
        .string()
        .length(6)
        .regex(/^\d{6}$/, 'Code must be 6 digits'),
}) as z.ZodType<MfaVerifyDto>;
