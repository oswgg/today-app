import { JwtUserPayload } from 'src/domain/entities/jwt-payload.entity';

export interface CreateJwtDto {
    user: JwtUserPayload;
}
