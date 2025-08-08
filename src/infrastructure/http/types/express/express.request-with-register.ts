import { Request } from 'express';

export interface ExpressRequestWithRegister<T = any> extends Request {
    register: T;
}
