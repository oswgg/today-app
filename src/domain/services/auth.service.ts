import { UserRole } from 'generated/prisma';
import { UserEntity } from '../entities/user.entity';
export interface UserFromOAuth
    extends Omit<Pick<UserEntity, 'name' | 'email' | 'uid'>, 'uid'> {
    uid: string;
}

export interface Session {
    access_token: string;
    refresh_token: string;
}

export interface LoginResult {
    user: {
        email: string;
        role: string;
    };
    // session: Session;
}

export interface Claims {
    role: UserRole;
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
