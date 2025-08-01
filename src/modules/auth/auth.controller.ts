import {
    BadRequestException,
    Body,
    Controller,
    Get,
    Post,
    Res,
} from '@nestjs/common';
import { Response } from 'express';
import { GetGoogleOAuthURL } from 'src/application/use-cases/get-google-oauth-url.usecase';
import { LoginWithOAuth } from 'src/application/use-cases/login-with-oauth.usecase';
import { LoginWithPassword } from 'src/application/use-cases/login-with-password.usecase';
import { RegisterOrganizerFromOAuth } from 'src/application/use-cases/register-organizer-from-oauth.usecase';
import { RegisterUserFromOAuth } from 'src/application/use-cases/register-user-from-oauth.usecase';
import { LoginWithPasswordDto } from 'src/domain/dto/login-with-password.dto';
import { OrganizerEntity } from 'src/domain/entities/organizer.entity';
import { UserEntity } from 'src/domain/entities/user.entity';
import { LoginResult } from 'src/domain/services/auth.service';
import { UserRole } from 'src/domain/types/user-role.enum';

@Controller('auth')
export class AuthController {
    constructor(
        private readonly getGoogleOAuthURL: GetGoogleOAuthURL,
        private readonly registerUserFromOAuth: RegisterUserFromOAuth,
        private readonly registerOganizerFromOAuth: RegisterOrganizerFromOAuth,
        private readonly loginWithOAuth: LoginWithOAuth,
        private readonly loginWithPassword: LoginWithPassword,
    ) {}

    @Get('oauth/google')
    async googleOAuth(@Res() res: Response): Promise<void> {
        return res.redirect(await this.getGoogleOAuthURL.execute());
    }

    @Post('register/oauth')
    OAuthRegister(
        @Body() body: { token: string; user_type: UserRole },
    ): Promise<UserEntity | OrganizerEntity> {
        const { token, user_type } = body;

        if (!token) throw new BadRequestException('Missing token');
        if (!user_type) throw new BadRequestException('Missing user_type');

        if (user_type !== UserRole.USER && user_type !== UserRole.ORGANIZER) {
            throw new BadRequestException('Invalid user_type');
        }

        if (user_type === UserRole.USER) {
            return this.registerUserFromOAuth.execute(body.token);
        }
        if (user_type === UserRole.ORGANIZER) {
            return this.registerOganizerFromOAuth.execute(body.token);
        }

        throw new Error('Invalid user_type');
    }

    @Post('login')
    async LoginWithPassword(
        @Body() body: LoginWithPasswordDto,
    ): Promise<LoginResult> {
        return await this.loginWithPassword.execute(body);
    }

    @Post('login/oauth')
    OAuthLogin(@Body() body: { token: string }): Promise<LoginResult> {
        const { token } = body;

        if (!token) throw new BadRequestException('Missing token');
        return this.loginWithOAuth.execute(body.token);
    }
}
