import {
    AuthService,
    Claims,
    LoginResult,
    UserFromOAuth,
} from 'src/domain/services/auth.service';
import { SupabaseUserMapper } from 'src/infrastructure/mappers/supabase.user.mapper';
import { SupabaseService } from '../database/supabase.service';
import {
    Inject,
    InternalServerErrorException,
    Logger,
    UnauthorizedException,
} from '@nestjs/common';
import { JWT_SERVICE_TOKEN, JwtService } from 'src/domain/services/jwt.service';
import { SupabaseConfig } from 'src/config/supabase.config';
import { I18nService } from 'nestjs-i18n';
import { I18nTranslations } from 'src/i18n/generated/i18n.generated';

export class SupabaseAuthService
    extends SupabaseService
    implements AuthService
{
    private readonly logger: Logger;

    constructor(
        supabaseConfig: SupabaseConfig,
        @Inject(JWT_SERVICE_TOKEN)
        private readonly jwtService: JwtService,
        private readonly translator: I18nService<I18nTranslations>,
    ) {
        super(supabaseConfig);
        this.logger = new Logger('SupabaseAuthService');
    }
    async getGoogleOAuthURL(): Promise<string> {
        // return await this.supabase.auth.signInWithOAuth({ provider: 'google' });
        const { data, error } = await this.supabase.auth.signInWithOAuth({
            provider: 'google',
        });

        if (error) {
            return '';
        }

        return data.url;
    }

    async getUserFromOAuthToken(token: string): Promise<UserFromOAuth> {
        const { data, error } = await this.supabase.auth.getUser(token);

        if (error) {
            if (error.code === 'bad_jwt') {
                // Invalid token expired, revoked or malformed.
                throw new UnauthorizedException(
                    this.translator.t('auth.errors.invalid_token'),
                );
            }

            this.logger.error(`Failed to get user from OAuth token`, error);

            throw new InternalServerErrorException( // Unknown error occurred
                this.translator.t('app.errors.general'),
            );
        }

        return SupabaseUserMapper.fromOAuth(data.user);
    }

    async loginWithOAuth(token: string, claims: Claims): Promise<LoginResult> {
        const { data, error } = await this.supabase.auth.getUser(token);

        if (error || !data.user) {
            throw new UnauthorizedException('Failed to login with OAuth');
        }
        const { error: updateError } =
            await this.supabase.auth.admin.updateUserById(data.user.id, {
                user_metadata: {
                    role: claims.user_role,
                    user_id: claims.user_id,
                },
            });

        if (updateError) {
            throw new InternalServerErrorException(
                this.translator.t('app.errors.general'),
            );
        }

        const customToken: string = this.jwtService.sign({
            user: {
                id: claims.user_id,
                email: claims.user_email,
                name: claims.user_name,
                role: claims.user_role,
                supabaseToken: claims.supabase_token,
            },
        });

        return {
            user: {
                email: claims.user_email,
                role: claims.user_role,
            },
            token: customToken,
        };
    }

    async loginWithPassword(
        email: string,
        password: string,
        claims: Claims,
    ): Promise<LoginResult> {
        const { data, error } = await this.supabase.auth.signInWithPassword({
            email,
            password,
        });

        if (error) {
            if (error.code === 'bad_password') {
                throw new UnauthorizedException(
                    this.translator.t('auth.errors.invalid_credentials'),
                );
            }

            // Unknown error occurred
            this.logger.error(`Failed to login with password`, error);
            throw new InternalServerErrorException(
                this.translator.t('app.errors.general'),
            );
        }

        // Get the Supabase session token
        const supabaseToken = data.session?.access_token;
        if (!supabaseToken) {
            throw new InternalServerErrorException(
                'Failed to obtain Supabase session token',
            );
        }

        const customToken: string = this.jwtService.sign({
            user: {
                id: claims.user_id,
                email: claims.user_email,
                name: claims.user_name,
                role: claims.user_role,
                supabaseToken: supabaseToken,
            },
        });

        return {
            user: {
                email: data.user.email!,
                role: claims.user_role,
            },
            token: customToken,
        };
    }
}
