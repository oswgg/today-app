import { LoginWithPasswordDto } from 'src/application/dtos/auth/login-with-password.dto';
import z from 'zod';

export const ZodLoginWithPassword = z.strictObject({
    email: z.email(),
    password: z.string().min(8).max(100),
}) as z.ZodType<LoginWithPasswordDto>;
