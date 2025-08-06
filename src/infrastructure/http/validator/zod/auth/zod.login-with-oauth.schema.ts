import { LoginWitOAuthDto } from 'src/application/dtos/auth/login-with-oaut.dto';
import z from 'zod';

export const ZodLoginWitOAuth = z.strictObject({
    token: z.string(),
}) as z.ZodType<LoginWitOAuthDto>;
