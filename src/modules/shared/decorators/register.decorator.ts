import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { ExpressRequestWithRegister } from 'src/infrastructure/http/types/express/express.request-with-register';

// El decorador acepta un tipo genérico T, pero TS solo lo fuerza al usarlo
export const Register = createParamDecorator(
    // data NO es útil aquí, lo ignoramos (pero se puede agregar para otros usos)
    (data: unknown, ctx: ExecutionContext): unknown => {
        const req = ctx.switchToHttp().getRequest<ExpressRequestWithRegister>();

        return req.register;
    },
);
