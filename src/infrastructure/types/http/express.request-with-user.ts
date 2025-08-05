import { Request } from 'express';
import { JwtUserPayload } from 'src/domain/entities/jwt-payload.entity';

export interface ExpressRequestWithUser extends Request {
    user: JwtUserPayload;
}
