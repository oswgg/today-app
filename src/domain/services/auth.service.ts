import { UserEntity } from '../entities/user.entity';
export interface UserFromOAuth
    extends Omit<Pick<UserEntity, 'name' | 'email' | 'uid'>, 'uid'> {
    uid: string;
}
export interface AuthService {
    getGoogleOAuthURL(): Promise<string>;
    getUserFromOAuthToken(token: string): Promise<UserFromOAuth>;
}

export const AUTH_SERVICE_TOKEN = Symbol('auth.service');
