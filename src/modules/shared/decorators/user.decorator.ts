import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { ExpressRequestWithUser } from 'src/infrastructure/http/types/express/express.request-with-user';

export const User = createParamDecorator(
    (data: string, ctx: ExecutionContext) => {
        const request: ExpressRequestWithUser = ctx.switchToHttp().getRequest();
        const user = request.user;

        if (!user) {
            throw new UnauthorizedException('User not found');
        }

        return user;
    },
);
