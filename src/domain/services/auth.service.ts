import { UserEntity } from '../entities/user.entity';

export interface AuthService {
    getGoogleOAuthURL(): Promise<string>;
    getUserFromOAuthToken(token: string): Promise<Partial<UserEntity>>;
}

export const AUTH_SERVICE_TOKEN = Symbol('auth.service');
