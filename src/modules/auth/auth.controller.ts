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
import { RegisterUserFromOAuth } from 'src/application/use-cases/register-user-from-oauth.usecase';
import { UserEntity } from 'src/domain/entities/user.entity';
import { UserRole } from 'src/domain/types/user-role.enum';

@Controller('auth')
export class AuthController {
    constructor(
        private readonly getGoogleOAuthURL: GetGoogleOAuthURL,
        private readonly registerUserFromOAuth: RegisterUserFromOAuth,
    ) {}

    @Get('google')
    async googleOAuth(@Res() res: Response): Promise<void> {
        return res.redirect(await this.getGoogleOAuthURL.execute());
    }

    @Post('google/callback')
    googleOAuthCallback(
        @Body() body: { token: string; user_type: UserRole },
    ): Promise<UserEntity> {
        const { token, user_type } = body;

        if (!token) throw new BadRequestException('Missing token');
        if (!user_type) throw new BadRequestException('Missing user_type');

        if (user_type !== UserRole.USER && user_type !== UserRole.ORGANIZER) {
            throw new BadRequestException('Invalid user_type');
        }

        if (user_type === UserRole.USER) {
            return this.registerUserFromOAuth.execute(body.token);
        }

        throw new Error('Invalid user_type');
    }
}
