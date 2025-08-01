import {
    AuthService,
    Claims,
    LoginResult,
    UserFromOAuth,
} from 'src/domain/services/auth.service';
import { SupabaseUserMapper } from 'src/infrastructure/mappers/supabase.user.mapper';
import { SupabaseService } from '../database/supabase.service';
import {
    InternalServerErrorException,
    UnauthorizedException,
} from '@nestjs/common';

export class SupabaseAuthService
    extends SupabaseService
    implements AuthService
{
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
            throw new Error('Failed to get user from OAuth token');
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
                    role: claims.role,
                    user_id: claims.user_id,
                },
            });

        if (updateError) {
            throw new InternalServerErrorException(
                'Failed to update user claims',
            );
        }
        // const { data: sessionData, error: sessionError } =
        //     await this.supabase.auth.getSession();

        // if (sessionError || !sessionData.session) {
        //     throw new InternalServerErrorException('Failed to get session');
        // }

        return {
            user: {
                email: data.user.email!,
                role: claims.role,
            },
            // session: {
            //     access_token: sessionData.session.access_token,
            //     refresh_token: sessionData.session.refresh_token,
            // },
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

        if (error || !data.user) {
            throw new UnauthorizedException('Failed to login with password');
        }

        const { error: updateError } =
            await this.supabase.auth.admin.updateUserById(data.user.id, {
                user_metadata: {
                    role: claims.role,
                    user_id: claims.user_id,
                },
            });

        if (updateError) {
            throw new InternalServerErrorException(
                'Failed to update user claims',
            );
        }

        return {
            user: {
                email: data.user.email!,
                role: claims.role,
            },
            // session: {
            //     access_token: sessionData.session.access_token,
            //     refresh_token: sessionData.session.refresh_token,
            // },
        };
    }
}
