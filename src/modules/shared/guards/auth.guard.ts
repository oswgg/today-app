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
import { IS_PUBLIC_KEY } from '../decorators/public.decorator';
import { ExpressRequestWithUser } from 'src/infrastructure/types/http/express.request-with-user';
import { I18nService } from 'nestjs-i18n';
import { I18nTranslations } from 'src/i18n/generated/i18n.generated';

@Injectable()
export class AuthGuard implements CanActivate {
    constructor(
        @Inject(JWT_SERVICE_TOKEN) private readonly jwtService: JwtService,
        private reflector: Reflector,
        private readonly translator: I18nService<I18nTranslations>,
    ) {}

    canActivate(context: ExecutionContext): boolean {
        const isPublic = this.reflector.getAllAndOverride<boolean>(
            IS_PUBLIC_KEY,
            [context.getHandler(), context.getClass()],
        );

        if (isPublic) {
            return true;
        }

        const request: ExpressRequestWithUser = context
            .switchToHttp()
            .getRequest();
        const token = this.extractTokenFromHeader(request);

        if (!token) {
            throw new UnauthorizedException(
                this.translator.t('auth.errors.missing_token'),
            );
        }

        try {
            const payload = this.jwtService.verify(token);

            if (!payload) {
                throw new UnauthorizedException(
                    this.translator.t('auth.errors.invalid_token'),
                );
            }

            request.user = payload.user;

            return true;
        } catch {
            throw new UnauthorizedException(
                this.translator.t('auth.errors.invalid_token'),
            );
        }
    }

    private extractTokenFromHeader(request: Request): string | undefined {
        const [type, token] = request.headers.authorization?.split(' ') ?? [];
        return type === 'Bearer' ? token : undefined;
    }
}
