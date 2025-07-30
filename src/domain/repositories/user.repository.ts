import { UserEntity } from 'src/domain/entities/user.entity';

export abstract class UserRepository {
    abstract findById(id: number): Promise<UserEntity | null>;
    abstract findByEmail(email: string): Promise<UserEntity | null>;
    abstract create(data: any): Promise<UserEntity>;
}

export const USER_REPO_TOKEN = Symbol('user.repository');
