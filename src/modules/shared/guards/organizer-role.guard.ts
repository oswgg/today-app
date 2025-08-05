import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { UserRole } from 'src/domain/types/user-role.enum';
import { ExpressRequestWithUser } from 'src/infrastructure/types/http/express.request-with-user';

@Injectable()
export class OrganizerGuard implements CanActivate {
    canActivate(context: ExecutionContext): boolean {
        const request: ExpressRequestWithUser = context
            .switchToHttp()
            .getRequest();

        const user_role = request.user.role;

        if (user_role !== UserRole.ORGANIZER) {
            return false;
        }

        return true;
    }
}
