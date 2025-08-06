import { RegisterWithOAuthDto } from 'src/application/dtos/auth/register-with-oauth.dto';
import { UserRole } from 'src/domain/types/user-role.enum';
import z from 'zod';

export const ZodRegisterWithOAuth = z.strictObject({
    token: z.string(),
    user_type: z.enum(Object.values(UserRole)),
}) as z.ZodType<RegisterWithOAuthDto>;
