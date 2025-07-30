import { AuthService } from 'src/domain/services/auth.service';
import { UserEntity } from 'src/domain/entities/user.entity';
import { SupabaseUserMapper } from 'src/infrastructure/mappers/supabase.user.mapper';
import { SupabaseService } from '../database/supabase.service';

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

    async getUserFromOAuthToken(token: string): Promise<Partial<UserEntity>> {
        const { data, error } = await this.supabase.auth.getUser(token);

        if (error) {
            throw new Error('Failed to get user from OAuth token');
        }

        return SupabaseUserMapper.fromOAuth(data.user);
    }
}
