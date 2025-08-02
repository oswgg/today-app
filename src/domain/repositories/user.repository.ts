import { UserEntity } from 'src/domain/entities/user.entity';
import { OrganizerEntity } from '../entities/organizer.entity';
import { UserFromOAuth } from '../services/auth.service';
import { CreateUserDto } from 'src/application/dtos/user/create-user.dto';

export interface UserRepository {
    findById(id: number): Promise<UserEntity | null>;
    findByEmail(email: string): Promise<UserEntity | null>;
    create(data: CreateUserDto): Promise<UserEntity>;

    registerUserFromOAuth(data: UserFromOAuth): Promise<UserEntity>;
    registerOrganizerFromOAuth(data: UserFromOAuth): Promise<OrganizerEntity>;
}

export const USER_REPO_TOKEN = Symbol('user.repository');
