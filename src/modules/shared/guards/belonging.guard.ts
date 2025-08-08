import {
    CanActivate,
    ExecutionContext,
    Inject,
    Injectable,
    NotFoundException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ExpressRequestWithRegister } from 'src/infrastructure/http/types/express/express.request-with-register';
import { BELONGS_TO_KEY } from '../decorators/belongs.decorator';
import {
    RESOURCE_OWNER_SERVICE,
    ResourceOwnerService,
} from 'src/domain/services/resource-owner.service';
import { ExpressRequestWithUser } from 'src/infrastructure/http/types/express/express.request-with-user';

@Injectable()
export class BelongingGuard implements CanActivate {
    constructor(
        @Inject(RESOURCE_OWNER_SERVICE)
        private readonly resourceOwnerService: ResourceOwnerService,
        private reflector: Reflector,
    ) {}

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const request = context
            .switchToHttp()
            .getRequest<ExpressRequestWithRegister & ExpressRequestWithUser>();

        const { table, owner, identify, entity } = this.reflector.get<{
            table: string;
            owner: string;
            identify: string;
            entity: string;
        }>(BELONGS_TO_KEY, context.getHandler());

        const register = await this.resourceOwnerService.isOwner(
            table,
            owner,
            identify,
            request.user.id,
            Number(request.params[identify]),
        );

        if (!register) {
            throw new NotFoundException(`${entity} not found`);
        }

        request.register = register;

        return true;
    }
}
