import { UserEntity } from './user.entity';

export type JwtUserPayload = Pick<UserEntity, 'id' | 'name' | 'email' | 'role'>;

export interface JWTPayload {
    user: JWTPayload;
    iat: number;
    exp: number;
}
