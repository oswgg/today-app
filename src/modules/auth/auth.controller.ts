import {
    BadRequestException,
    Body,
    Controller,
    Get,
    Post,
    Res,
} from '@nestjs/common';
import { Response } from 'express';
import { LoginWithPasswordDto } from 'src/application/dtos/auth/login-with-password.dto';
import { GetGoogleOAuthURL } from 'src/application/use-cases/auth/get-google-oauth-url.usecase';
import { LoginWithOAuth } from 'src/application/use-cases/auth/login-with-oauth.usecase';
import { LoginWithPassword } from 'src/application/use-cases/auth/login-with-password.usecase';
import { RegisterOrganizerFromOAuth } from 'src/application/use-cases/auth/register-organizer-from-oauth.usecase';
import { RegisterUserFromOAuth } from 'src/application/use-cases/auth/register-user-from-oauth.usecase';
import { OrganizerEntity } from 'src/domain/entities/organizer.entity';
import { UserEntity } from 'src/domain/entities/user.entity';
import { LoginResult } from 'src/domain/services/auth.service';
import { UserRole } from 'src/domain/types/user-role.enum';
import { Public } from '../shared/guards/public.guard';
import { ValidationPipe } from '../shared/pipes/validation.pipe';
import { ZodValidator } from 'src/infrastructure/http/validator/zod/zod.validator';
import { ZodLoginWithPassword } from 'src/infrastructure/http/validator/zod/auth/zod.login-with-password.schema';
import { ZodLoginWitOAuth } from 'src/infrastructure/http/validator/zod/auth/zod.login-with-oauth.schema';
import { LoginWitOAuthDto } from 'src/application/dtos/auth/login-with-oaut.dto';
import { ZodRegisterWithOAuth } from 'src/infrastructure/http/validator/zod/auth/zod.register-with-oauth.schema';
import { RegisterWithOAuthDto } from 'src/application/dtos/auth/register-with-oauth.dto';
import { I18nService } from 'nestjs-i18n';
import { I18nTranslations } from 'src/i18n/generated/i18n.generated';

@Public()
@Controller('auth')
export class AuthController {
    constructor(
        private readonly getGoogleOAuthURL: GetGoogleOAuthURL,
        private readonly registerUserFromOAuth: RegisterUserFromOAuth,
        private readonly registerOganizerFromOAuth: RegisterOrganizerFromOAuth,
        private readonly loginWithOAuth: LoginWithOAuth,
        private readonly loginWithPassword: LoginWithPassword,
        private translator: I18nService<I18nTranslations>,
    ) {}

    @Get('oauth/google')
    async googleOAuth(@Res() res: Response): Promise<void> {
        return res.redirect(await this.getGoogleOAuthURL.execute());
    }

    @Post('register/oauth')
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

    @Post('login')
    async LoginWithPassword(
        @Body(new ValidationPipe(new ZodValidator(ZodLoginWithPassword)))
        body: LoginWithPasswordDto,
    ): Promise<LoginResult> {
        return await this.loginWithPassword.execute(body);
    }

    @Post('login/oauth')
    OAuthLogin(
        @Body(new ValidationPipe(new ZodValidator(ZodLoginWitOAuth)))
        body: LoginWitOAuthDto,
    ): Promise<LoginResult> {
        const { token } = body;

        if (!token)
            throw new BadRequestException(
                this.translator.t('auth.errors.missing_token'),
            );
        return this.loginWithOAuth.execute(body.token);
    }
}
