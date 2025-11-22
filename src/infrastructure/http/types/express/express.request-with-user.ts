import { Request } from 'express';
import { JwtUserPayload } from 'src/domain/entities/auth/jwt-payload.entity';

export interface ExpressRequestWithUser extends Request {
    user: JwtUserPayload;
}
