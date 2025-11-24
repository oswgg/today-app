import {
    BadRequestException,
    Body,
    Controller,
    Delete,
    Get,
    Post,
    Res,
    UnauthorizedException,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { Response } from 'express';
import {
    ApiRegisterWithOAuth,
    ApiLoginWithPassword,
    ApiLoginWithOAuth,
} from './auth.swagger';
import { LoginWithPasswordDto } from 'src/application/dtos/auth/login-with-password.dto';
import { GetGoogleOAuthURL } from 'src/application/use-cases/auth/get-google-oauth-url.usecase';
import { LoginWithOAuth } from 'src/application/use-cases/auth/login-with-oauth.usecase';
import { LoginWithPassword } from 'src/application/use-cases/auth/login-with-password.usecase';
import { RegisterOrganizerFromOAuth } from 'src/application/use-cases/auth/register-organizer-from-oauth.usecase';
import { RegisterUserFromOAuth } from 'src/application/use-cases/auth/register-user-from-oauth.usecase';
import { OrganizerEntity, UserEntity } from 'src/domain/entities/users';
import { LoginResult } from 'src/domain/services/auth.service';
import { UserRole } from 'src/domain/types/user-role.enum';
import { Public } from '../shared/decorators/public.decorator';
import { ValidationPipe } from '../shared/pipes/validation.pipe';
import { ZodValidator } from 'src/infrastructure/http/validator/zod/zod.validator';
import { ZodLoginWithPassword } from 'src/infrastructure/http/validator/zod/auth/zod.login-with-password.schema';
import { ZodLoginWitOAuth } from 'src/infrastructure/http/validator/zod/auth/zod.login-with-oauth.schema';
import { LoginWitOAuthDto } from 'src/application/dtos/auth/login-with-oaut.dto';
import { ZodRegisterWithOAuth } from 'src/infrastructure/http/validator/zod/auth/zod.register-with-oauth.schema';
import { RegisterWithOAuthDto } from 'src/application/dtos/auth/register-with-oauth.dto';
import { I18nService } from 'nestjs-i18n';
import { I18nTranslations } from 'src/i18n/generated/i18n.generated';
import { User } from '../shared/decorators/user.decorator';
import { MfaEnrollDto } from 'src/application/dtos/auth/mfa-enroll.dto';
import { MfaVerifyDto } from 'src/application/dtos/auth/mfa-verify.dto';
import { JwtUserPayload } from 'src/domain/entities/auth/jwt-payload.entity';
import { ZodMfaEnroll } from 'src/infrastructure/http/validator/zod/auth/zod.mfa-enroll.schema';
import { ZodMfaVerify } from 'src/infrastructure/http/validator/zod/auth/zod.mfa-verify.schema';
import { EnrollMfa } from 'src/application/use-cases/mfa/enroll-mfa.usecase';
import { VerifyAndEnableMfa } from 'src/application/use-cases/mfa/verify-and-enable-mfa.usecase';
import { GetMfaStatus } from 'src/application/use-cases/mfa/get-mfa-status.usecase';
import { UnenrollMfa } from 'src/application/use-cases/mfa/unenroll-mfa.usecase';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
    constructor(
        private readonly getGoogleOAuthURL: GetGoogleOAuthURL,
        private readonly registerUserFromOAuth: RegisterUserFromOAuth,
        private readonly registerOganizerFromOAuth: RegisterOrganizerFromOAuth,
        private readonly loginWithOAuth: LoginWithOAuth,
        private readonly loginWithPassword: LoginWithPassword,
        private readonly enrollMfaUseCase: EnrollMfa,
        private readonly verifyAndEnableMfaUseCase: VerifyAndEnableMfa,
        private readonly getMfaStatusUseCase: GetMfaStatus,
        private readonly unenrollMfaUseCase: UnenrollMfa,
        private translator: I18nService<I18nTranslations>,
    ) {}

    @Public()
    @Get('oauth/google')
    @ApiOperation({
        summary: 'Get Google OAuth URL',
        description: 'Redirects to Google OAuth URL for authentication',
    })
    @ApiResponse({ status: 302, description: 'Redirects to Google OAuth' })
    async googleOAuth(@Res() res: Response): Promise<void> {
        return res.redirect(await this.getGoogleOAuthURL.execute());
    }

    @Public()
    @Post('register/oauth')
    @ApiRegisterWithOAuth()
    OAuthRegister(
        @Body(new ValidationPipe(new ZodValidator(ZodRegisterWithOAuth)))
        body: RegisterWithOAuthDto,
    ): Promise<UserEntity | OrganizerEntity> {
        const { token, user_type } = body;

        if (!token)
            throw new BadRequestException(
                this.translator.t('auth.errors.missing_token'),
            );
        if (!user_type)
            throw new BadRequestException(
                this.translator.t('auth.errors.missing_user_type'),
            );

        if (user_type !== UserRole.USER && user_type !== UserRole.ORGANIZER) {
            throw new BadRequestException(
                this.translator.t('auth.errors.invalid_user_type'),
            );
        }

        if (user_type === UserRole.USER) {
            return this.registerUserFromOAuth.execute(body.token);
        }
        if (user_type === UserRole.ORGANIZER) {
            return this.registerOganizerFromOAuth.execute(body.token);
        }

        throw new BadRequestException(
            this.translator.t('auth.errors.invalid_user_type'),
        );
    }

    @Public()
    @Post('login')
    @ApiLoginWithPassword()
    async LoginWithPassword(
        @Body(new ValidationPipe(new ZodValidator(ZodLoginWithPassword)))
        body: LoginWithPasswordDto,
    ): Promise<LoginResult> {
        return await this.loginWithPassword.execute(body);
    }

    @Public()
    @Post('login/oauth')
    @ApiLoginWithOAuth()
    OAuthLogin(
        @Body(new ValidationPipe(new ZodValidator(ZodLoginWitOAuth)))
        body: LoginWitOAuthDto,
    ): Promise<LoginResult> {
        const { token } = body;

        if (!token)
            throw new BadRequestException(
                this.translator.t('auth.errors.invalid_token'),
            );
        return this.loginWithOAuth.execute(body.token);
    }

    // MFA Management Endpoints
    @Post('mfa/enroll')
    @ApiOperation({
        summary: 'Enroll in MFA',
        description:
            'Start MFA enrollment process. Returns QR code for TOTP setup.',
    })
    @ApiResponse({ status: 201, description: 'MFA enrollment initiated' })
    async enrollMfa(
        @User() user: JwtUserPayload,
        @Body(new ValidationPipe(new ZodValidator(ZodMfaEnroll)))
        body: MfaEnrollDto,
    ) {
        if (!user.supabaseToken) {
            throw new UnauthorizedException(
                'Supabase token is missing from your session. Please login again.',
            );
        }

        return await this.enrollMfaUseCase.execute(
            Number(user.id),
            body.factorType,
            user.supabaseToken,
            body.friendlyName,
        );
    }

    @Post('mfa/verify')
    @ApiOperation({
        summary: 'Verify and enable MFA',
        description: 'Verify MFA code and enable MFA for the user.',
    })
    @ApiResponse({ status: 200, description: 'MFA enabled successfully' })
    async verifyAndEnableMfa(
        @User() user: JwtUserPayload,
        @Body(new ValidationPipe(new ZodValidator(ZodMfaVerify)))
        body: MfaVerifyDto,
    ) {
        if (!user.supabaseToken) {
            throw new UnauthorizedException(
                'Supabase token is missing from your session. Please login again.',
            );
        }

        return await this.verifyAndEnableMfaUseCase.execute(
            Number(user.id),
            body.factorId,
            body.code,
            user.supabaseToken,
        );
    }

    @Get('mfa/status')
    @ApiOperation({
        summary: 'Get MFA status',
        description: 'Get current MFA status for the authenticated user.',
    })
    @ApiResponse({ status: 200, description: 'MFA status retrieved' })
    async getMfaStatus(@User() user: JwtUserPayload) {
        return await this.getMfaStatusUseCase.execute(Number(user.id));
    }

    @Delete('mfa/unenroll')
    @ApiOperation({
        summary: 'Disable MFA',
        description: 'Unenroll and disable MFA for the user.',
    })
    @ApiResponse({ status: 200, description: 'MFA disabled successfully' })
    async unenrollMfa(@User() user: JwtUserPayload) {
        if (!user.supabaseToken) {
            throw new UnauthorizedException(
                'Supabase token is missing from your session. Please login again.',
            );
        }

        return await this.unenrollMfaUseCase.execute(
            Number(user.id),
            user.supabaseToken,
        );
    }
}
