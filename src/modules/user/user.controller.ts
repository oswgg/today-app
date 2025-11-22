import {
    BadRequestException,
    Controller,
    Get,
    Param,
    UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { ApiGetUserById } from './user.swagger';
import { GetUser } from 'src/application/use-cases/auth/get-user.usecase';
import { UserEntity } from 'src/domain/entities/users';
import { I18nService } from 'nestjs-i18n';
import { I18nTranslations } from 'src/i18n/generated/i18n.generated';

@ApiTags('user')
@ApiBearerAuth('JWT-auth')
@Controller('user')
export class UserController {
    constructor(
        private readonly getUser: GetUser,
        private readonly translator: I18nService<I18nTranslations>,
    ) {}
}
