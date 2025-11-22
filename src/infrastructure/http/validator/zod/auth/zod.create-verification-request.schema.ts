import { CreateVerificationRequestDto } from 'src/application/dtos/auth/verification-requests/create-verification.dto';
import { VerificationRequestRequestedRole } from 'src/domain/entities/auth/verification-requests/verification-request.entity';
import { UserRole } from 'src/domain/types/user-role.enum';
import z, { ZodType } from 'zod';

export const ZodCreateVerificationRequestSchema = z.strictObject({
    contactName: z.string(),
    phoneNumber: z.string(),
    requestedRole: z.enum(Object.values(VerificationRequestRequestedRole)),
    businessName: z.string(),
    // Accepts either:
    // - an array of strings (when body parser produces arrays), or
    // - a JSON string (when client sends JSON.stringify([...]) in multipart FormData)
    socialsMediaLinks: z.preprocess((val) => {
        if (typeof val === 'string') {
            // try to parse JSON string -> array
            try {
                const parsed = JSON.parse(val);
                return Array.isArray(parsed) ? parsed : [String(parsed)];
            } catch (e) {
                // not JSON: treat as single value -> wrap in array
                return [val];
            }
        }
        return val;
    }, z.array(z.string())),
    googleMapsLink: z.string().nullable(),
    websiteLink: z.string().nullable(),
}) as ZodType<Omit<CreateVerificationRequestDto, 'userId' | 'documents'>>;
