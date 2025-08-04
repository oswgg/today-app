import { UserEntity } from '../entities/user.entity';
import { UserRole } from '../types/user-role.enum';
export interface UserFromOAuth
    extends Omit<Pick<UserEntity, 'name' | 'email' | 'uid'>, 'uid'> {
    uid: string;
}

export interface LoginResult {
    user: {
        email: string;
        role: string;
    };
    token: string;
}

export interface Claims {
    user_email: string;
    user_name: string;
    user_role: UserRole;
    user_id: number | bigint;
}

export interface AuthService {
    getGoogleOAuthURL(): Promise<string>;
    getUserFromOAuthToken(token: string): Promise<UserFromOAuth>;
    loginWithOAuth(token: string, claims: Claims): Promise<LoginResult>;
    loginWithPassword(
        email: string,
        password: string,
        claims: Claims,
    ): Promise<LoginResult>;
}

export const AUTH_SERVICE_TOKEN = Symbol('auth.service');
