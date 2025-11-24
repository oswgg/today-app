import {
    InstitutionEntity,
    OrganizerEntity,
    UserEntity,
} from '../entities/users';
import { UserFromOAuth } from '../services/auth.service';
import { CreateUserDto } from 'src/application/dtos/user/create-user.dto';

export interface UpdateMfaDto {
    mfaEnabled?: boolean;
    mfaFactorId?: string | null;
    mfaRequired?: boolean;
}

export interface UserRepository {
    findById(id: number): Promise<UserEntity | null>;
    findByEmail(email: string): Promise<UserEntity | null>;
    create(
        data: CreateUserDto,
    ): Promise<UserEntity | OrganizerEntity | InstitutionEntity>;

    registerUserFromOAuth(data: UserFromOAuth): Promise<UserEntity>;
    registerOrganizerFromOAuth(data: UserFromOAuth): Promise<OrganizerEntity>;

    updateMfaSettings(userId: number, data: UpdateMfaDto): Promise<UserEntity>;
}

export const USER_REPO_TOKEN = Symbol('user.repository');
