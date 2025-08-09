import { BadRequestException, Controller, Get, Param } from '@nestjs/common';
import { GetUser } from 'src/application/use-cases/auth/get-user.usecase';
import { UserEntity } from 'src/domain/entities/user.entity';
import { I18nService } from 'nestjs-i18n';
import { I18nTranslations } from 'src/i18n/generated/i18n.generated';

@Controller('user')
export class UserController {
    constructor(
        private readonly getUser: GetUser,
        private readonly translator: I18nService<I18nTranslations>,
    ) {}

    @Get(':id')
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
