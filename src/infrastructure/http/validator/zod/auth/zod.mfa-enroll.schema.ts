import {
    MfaEnrollDto,
    MfaFactorType,
} from 'src/application/dtos/auth/mfa-enroll.dto';
import z from 'zod';

export const ZodMfaEnroll = z.strictObject({
    factorType: z.enum(MfaFactorType),
    friendlyName: z.string().min(1).max(100).optional(),
}) as z.ZodType<MfaEnrollDto>;
