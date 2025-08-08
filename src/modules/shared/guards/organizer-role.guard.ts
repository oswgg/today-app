import {
    CanActivate,
    ExecutionContext,
    Injectable,
    ForbiddenException,
} from '@nestjs/common';
import { UserRole } from 'src/domain/types/user-role.enum';
import { I18nService } from 'nestjs-i18n';
import { I18nTranslations } from 'src/i18n/generated/i18n.generated';
import { ExpressRequestWithUser } from 'src/infrastructure/http/types/express/express.request-with-user';

@Injectable()
export class OrganizerGuard implements CanActivate {
    constructor(private readonly translator: I18nService<I18nTranslations>) {}

    canActivate(context: ExecutionContext): boolean {
        const request: ExpressRequestWithUser = context
            .switchToHttp()
            .getRequest();

        const user_role = request.user.role;

        if (user_role !== UserRole.ORGANIZER) {
            throw new ForbiddenException(
                this.translator.t('auth.errors.organizer_role_required'),
            );
        }

        return true;
    }
}
