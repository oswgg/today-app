import {
    CanActivate,
    ExecutionContext,
    Injectable,
    UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { I18nService } from 'nestjs-i18n';
import { I18nTranslations } from 'src/i18n/generated/i18n.generated';
import { ExpressRequestWithUser } from 'src/infrastructure/http/types/express/express.request-with-user';
import { GetMfaStatus } from 'src/application/use-cases/mfa/get-mfa-status.usecase';
import { VerifyMfaCode } from 'src/application/use-cases/mfa/verify-mfa-code.usecase';
import { MFA_REQUIRED_KEY } from '../decorators/require-mfa.decorator';
import { SKIP_MFA_KEY } from '../decorators/skip-mfa.decorator';
import { IS_PUBLIC_KEY } from '../decorators/public.decorator';

@Injectable()
export class MfaGuard implements CanActivate {
    constructor(
        private readonly reflector: Reflector,
        private readonly getMfaStatusUseCase: GetMfaStatus,
        private readonly verifyMfaCodeUseCase: VerifyMfaCode,
        private readonly translator: I18nService<I18nTranslations>,
    ) {}

    async canActivate(context: ExecutionContext): Promise<boolean> {
        // Check if route is public
        const isPublic = this.reflector.getAllAndOverride<boolean>(
            IS_PUBLIC_KEY,
            [context.getHandler(), context.getClass()],
        );

        if (isPublic) {
            return true;
        }

        // Check if MFA should be skipped on this specific route
        const skipMfa = this.reflector.getAllAndOverride<boolean>(
            SKIP_MFA_KEY,
            [context.getHandler(), context.getClass()],
        );

        if (skipMfa) {
            return true;
        }

        // Check if MFA is required for this route or controller
        const mfaRequired = this.reflector.getAllAndOverride<boolean>(
            MFA_REQUIRED_KEY,
            [context.getHandler(), context.getClass()],
        );

        // If MFA is not explicitly required, allow access
        if (!mfaRequired) {
            return true;
        }

        const request: ExpressRequestWithUser = context
            .switchToHttp()
            .getRequest();

        // User should be attached by AuthGuard at this point
        if (!request.user) {
            throw new UnauthorizedException(
                this.translator.t('auth.errors.invalid_token'),
            );
        }

        const userId = Number(request.user.id);

        // Get user's MFA status
        const mfaStatus = await this.getMfaStatusUseCase.execute(userId);

        // If user doesn't have MFA enabled, deny access to MFA-required routes
        if (!mfaStatus.enabled) {
            throw new UnauthorizedException(
                this.translator.t('auth.errors.mfa.enabled_required'),
            );
        }

        // Extract MFA token from header
        const mfaToken = this.extractMfaTokenFromHeader(request);

        if (!mfaToken) {
            throw new UnauthorizedException(
                this.translator.t('auth.errors.mfa.code_required'),
            );
        }

        // Get Supabase token from JWT user payload
        const supabaseToken = request.user.supabaseToken;

        if (!supabaseToken) {
            throw new UnauthorizedException(
                this.translator.t('auth.errors.supabase_token_missing'),
            );
        }

        // Verify the MFA code
        const isValid = await this.verifyMfaCodeUseCase.execute(
            userId,
            mfaToken,
            supabaseToken,
        );

        if (!isValid) {
            throw new UnauthorizedException(
                this.translator.t('auth.errors.mfa.code_invalid'),
            );
        }

        return true;
    }

    private extractMfaTokenFromHeader(
        request: ExpressRequestWithUser,
    ): string | undefined {
        return request.headers['x-mfa-token'] as string | undefined;
    }
}
