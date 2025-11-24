import { UserEntity } from '../users';

export type JwtUserPayload = Pick<
    UserEntity,
    'id' | 'name' | 'email' | 'role'
> & {
    supabaseToken: string;
};

export interface JWTPayload {
    user: JwtUserPayload;
    iat: number;
    exp: number;
}
