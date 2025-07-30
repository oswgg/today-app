import { BadRequestException, Controller, Get, Param } from '@nestjs/common';
import { GetUser } from 'src/application/use-cases/get-user.usecase';
import { UserEntity } from 'src/domain/entities/user.entity';

@Controller('user')
export class UserController {
    constructor(private readonly getUser: GetUser) {}

    @Get(':id')
    async getUserById(@Param('id') id: number): Promise<UserEntity> {
        if (isNaN(Number(id))) {
            throw new BadRequestException('Invalid user ID');
        }
        if (id <= 0) {
            throw new BadRequestException('Invalid user ID');
        }
        return await this.getUser.execute(id);
    }
}
