import {
    CanActivate,
    ExecutionContext,
    ForbiddenException,
    Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { I18nService } from 'nestjs-i18n';
import { I18nTranslations } from 'src/i18n/generated/i18n.generated';
import { ExpressRequestWithUser } from 'src/infrastructure/http/types/express/express.request-with-user';
import { REQUIRED_ROLE_KEY } from '../decorators/required-user-role.decorator';
import { UserRole } from 'src/domain/types/user-role.enum';

@Injectable()
export class UserRoleGuard implements CanActivate {
    constructor(
        private readonly translator: I18nService<I18nTranslations>,
        private readonly reflector: Reflector,
    ) {}

    canActivate(context: ExecutionContext): boolean {
        const request: ExpressRequestWithUser = context
            .switchToHttp()
            .getRequest();

        const requiredRoles = this.reflector.getAllAndOverride<UserRole[]>(
            REQUIRED_ROLE_KEY,
            [context.getClass(), context.getHandler()],
        );

        if (!requiredRoles || requiredRoles.length === 0) {
            return true;
        }

        const userRole = request.user.role;

        if (requiredRoles && !requiredRoles.includes(userRole)) {
            throw new ForbiddenException(
                this.translator.t('auth.errors.inssufficient_user_role'),
            );
        }

        return true;
    }
}
