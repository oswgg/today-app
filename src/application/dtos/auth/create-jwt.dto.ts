import { JwtUserPayload } from 'src/domain/entities/auth/jwt-payload.entity';

export interface CreateJwtDto {
    user: JwtUserPayload;
}
