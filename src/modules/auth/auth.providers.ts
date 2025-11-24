import { Provider } from '@nestjs/common';
import { GetGoogleOAuthURL } from 'src/application/use-cases/auth/get-google-oauth-url.usecase';
import { LoginWithOAuth } from 'src/application/use-cases/auth/login-with-oauth.usecase';
import { LoginWithPassword } from 'src/application/use-cases/auth/login-with-password.usecase';
import { RegisterOrganizerFromOAuth } from 'src/application/use-cases/auth/register-organizer-from-oauth.usecase';
import { RegisterUserFromOAuth } from 'src/application/use-cases/auth/register-user-from-oauth.usecase';
import { EnrollMfa } from 'src/application/use-cases/mfa/enroll-mfa.usecase';
import { GetMfaStatus } from 'src/application/use-cases/mfa/get-mfa-status.usecase';
import { UnenrollMfa } from 'src/application/use-cases/mfa/unenroll-mfa.usecase';
import { VerifyAndEnableMfa } from 'src/application/use-cases/mfa/verify-and-enable-mfa.usecase';
import { VerifyMfaCode } from 'src/application/use-cases/mfa/verify-mfa-code.usecase';
import { AUTH_SERVICE_TOKEN } from 'src/domain/services/auth.service';
import { JWT_SERVICE_TOKEN } from 'src/domain/services/jwt.service';
import { MFA_SERVICE_TOKEN } from 'src/domain/services/mfa.service';
import { NestJwtService } from 'src/infrastructure/services/nest.jwt.service.impl';
import { SupabaseAuthService } from 'src/infrastructure/services/supabase.auth.service.impl';
import { SupabaseMfaService } from 'src/infrastructure/services/supabase.mfa.service.impl';

export const AuthServiceProviders: Provider[] = [
    {
        provide: JWT_SERVICE_TOKEN,
        useClass: NestJwtService,
    },
    {
        provide: AUTH_SERVICE_TOKEN,
        useClass: SupabaseAuthService,
    },
    {
        provide: MFA_SERVICE_TOKEN,
        useClass: SupabaseMfaService,
    },
];

export const AuthUseCaseProviders: Provider[] = [
    GetGoogleOAuthURL,
    RegisterUserFromOAuth,
    RegisterOrganizerFromOAuth,
    LoginWithOAuth,
    LoginWithPassword,
    EnrollMfa,
    VerifyAndEnableMfa,
    VerifyMfaCode,
    UnenrollMfa,
    GetMfaStatus,
];
