import { UserEntity } from 'src/domain/entities/user.entity';
import { CreateUserDto } from '../dto/create-user.dto';
import { OrganizerEntity } from '../entities/organizer.entity';
import { UserFromOAuth } from '../services/auth.service';

export abstract class UserRepository {
    abstract findById(id: number): Promise<UserEntity | null>;
    abstract findByEmail(email: string): Promise<UserEntity | null>;
    abstract create(data: CreateUserDto): Promise<UserEntity>;

    abstract registerUserFromOAuth(data: UserFromOAuth): Promise<UserEntity>;
    abstract registerOrganizerFromOAuth(
        data: UserFromOAuth,
    ): Promise<OrganizerEntity>;
}

export const USER_REPO_TOKEN = Symbol('user.repository');
