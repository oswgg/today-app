import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { UserEntity } from 'src/domain/entities/user.entity';
import {
    USER_REPO_TOKEN,
    UserRepository,
} from 'src/domain/repositories/user.repository';

@Injectable()
export class GetUser {
    constructor(
        @Inject(USER_REPO_TOKEN) private readonly userRepo: UserRepository,
    ) {}

    async execute(id: number): Promise<UserEntity> {
        const user = await this.userRepo.findById(id);
        if (!user) {
            throw new NotFoundException('User not found');
        }

        return user;
    }
}
