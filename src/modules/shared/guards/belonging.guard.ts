import {
    CanActivate,
    ExecutionContext,
    Inject,
    Injectable,
    NotFoundException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ExpressRequestWithRegister } from 'src/infrastructure/http/types/express/express.request-with-register';
import {
    BELONGS_TO_KEY,
    BelongsToOptions,
} from '../decorators/belongs.decorator';
import {
    RESOURCE_OWNER_SERVICE,
    ResourceOwnerService,
} from 'src/domain/services/resource-owner.service';
import { ExpressRequestWithUser } from 'src/infrastructure/http/types/express/express.request-with-user';
import { I18nTranslations } from 'src/i18n/generated/i18n.generated';
import { I18nService } from 'nestjs-i18n';

@Injectable()
export class BelongingGuard implements CanActivate {
    constructor(
        @Inject(RESOURCE_OWNER_SERVICE)
        private readonly resourceOwnerService: ResourceOwnerService,
        private reflector: Reflector,
        private readonly translator: I18nService<I18nTranslations>,
    ) {}

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const request = context
            .switchToHttp()
            .getRequest<ExpressRequestWithRegister & ExpressRequestWithUser>();

        const { table, owner, identify, entity, message_path } =
            this.reflector.get<BelongsToOptions>(
                BELONGS_TO_KEY,
                context.getHandler(),
            );

        const register = await this.resourceOwnerService.isOwner(
            table,
            owner,
            identify,
            request.user.id,
            Number(request.params[identify]),
        );

        if (!register) {
            let message_not_found: string | undefined = undefined;
            if (message_path) {
                message_not_found = this.translator.t(message_path);
                throw new NotFoundException(message_not_found);
            }
            if (entity) {
                message_not_found = this.translator.t(
                    'app.errors.entity_not_found',
                    { args: { entity } },
                );
                throw new NotFoundException(message_not_found);
            }
            throw new NotFoundException(
                this.translator.t('app.errors.not_found'),
            );
        }

        request.register = register;

        return true;
    }
}
