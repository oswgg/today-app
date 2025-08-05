import { UserEntity } from './user.entity';

export type JwtUserPayload = Pick<UserEntity, 'id' | 'name' | 'email' | 'role'>;

export interface JWTPayload {
    user: JwtUserPayload;
    iat: number;
    exp: number;
}
