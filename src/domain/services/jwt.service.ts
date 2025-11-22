import { CreateJwtDto } from 'src/application/dtos/auth/create-jwt.dto';
import { JWTPayload } from '../entities/auth/jwt-payload.entity';

export interface JwtService {
    sign(payload: CreateJwtDto): string;
    verify(token: string): JWTPayload | null;
}

export const JWT_SERVICE_TOKEN = Symbol('jwt.service');
