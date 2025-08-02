import { Provider } from '@nestjs/common';
import { GetGoogleOAuthURL } from 'src/application/use-cases/auth/get-google-oauth-url.usecase';
import { LoginWithOAuth } from 'src/application/use-cases/auth/login-with-oauth.usecase';
import { LoginWithPassword } from 'src/application/use-cases/auth/login-with-password.usecase';
import { RegisterOrganizerFromOAuth } from 'src/application/use-cases/auth/register-organizer-from-oauth.usecase';
import { RegisterUserFromOAuth } from 'src/application/use-cases/auth/register-user-from-oauth.usecase';
import { AUTH_SERVICE_TOKEN } from 'src/domain/services/auth.service';
import { SupabaseAuthService } from 'src/infrastructure/services/supabase.auth.service.impl';

export const AuthServiceProviders: Provider[] = [
    {
        provide: AUTH_SERVICE_TOKEN,
        useClass: SupabaseAuthService,
    },
];

export const AuthUseCaseProviders: Provider[] = [
    GetGoogleOAuthURL,
    RegisterUserFromOAuth,
    RegisterOrganizerFromOAuth,
    LoginWithOAuth,
    LoginWithPassword,
];
