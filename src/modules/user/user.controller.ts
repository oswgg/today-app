import { BadRequestException, Controller, Get, Param } from '@nestjs/common';
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

    @Get(':id')
    @ApiGetUserById()
    async getUserById(@Param('id') id: number): Promise<UserEntity> {
        if (isNaN(Number(id))) {
            throw new BadRequestException(
                this.translator.t('users.errors.invalid_id'),
            );
        }
        if (id <= 0) {
            throw new BadRequestException(
                this.translator.t('users.errors.invalid_id'),
            );
        }
        return await this.getUser.execute(id);
    }
}
