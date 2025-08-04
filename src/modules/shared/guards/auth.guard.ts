import {
    CanActivate,
    ExecutionContext,
    Inject,
    Injectable,
    UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Request } from 'express';
import { JWT_SERVICE_TOKEN, JwtService } from 'src/domain/services/jwt.service';
import { IS_PUBLIC_KEY } from './public.guard';

@Injectable()
export class AuthGuard implements CanActivate {
    constructor(
        @Inject(JWT_SERVICE_TOKEN) private readonly jwtService: JwtService,
        private reflector: Reflector,
    ) {}

    canActivate(context: ExecutionContext): boolean {
        const isPublic = this.reflector.getAllAndOverride<boolean>(
            IS_PUBLIC_KEY,
            [context.getHandler(), context.getClass()],
        );

        if (isPublic) {
            return true;
        }

        const request: Request = context.switchToHttp().getRequest();
        const token = this.extractTokenFromHeader(request);

        if (!token) {
            throw new UnauthorizedException('Missing or invalid token');
        }

        try {
            const payload = this.jwtService.verify(token);

            if (!payload) {
                throw new UnauthorizedException('Invalid token');
            }

            return true;
        } catch {
            throw new UnauthorizedException('Invalid token');
        }
    }

    private extractTokenFromHeader(request: Request): string | undefined {
        const [type, token] = request.headers.authorization?.split(' ') ?? [];
        return type === 'Bearer' ? token : undefined;
    }
}
