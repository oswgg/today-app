import { CreateUserDto } from 'src/application/dtos/user/create-user.dto';
import {
    InstitutionEntity,
    OrganizerEntity,
    UserEntity,
} from 'src/domain/entities/users';
import {
    UpdateMfaDto,
    UserRepository,
} from 'src/domain/repositories/user.repository';
import { UserFromOAuth } from 'src/domain/services/auth.service';
import { SequelizeService } from '../database/sequelize/sequelize.service';
import { UserModel } from '../database/sequelize/models';
import { Inject } from '@nestjs/common';
import { Sequelize } from 'sequelize';
import { SQZUserMapper } from '../mappers/sequelize/sqz.user.mapper';
import { UserRole } from 'src/domain/types/user-role.enum';
import { SEQUELIZE } from '../database/sequelize/constants';

export class SQZUserRepoImpl
    extends SequelizeService<UserEntity>
    implements UserRepository
{
    private readonly userModel: typeof UserModel;

    constructor(@Inject(SEQUELIZE) protected readonly sequelize: Sequelize) {
        super(sequelize);
        this.userModel = sequelize.models.UserModel as typeof UserModel;
    }

    async findByEmail(email: string): Promise<UserEntity | null> {
        const _user = await this.userModel.findOne({ where: { email } });
        if (!_user) return null;
        return SQZUserMapper.toEntity(_user);
    }

    async findById(id: number): Promise<UserEntity | null> {
        const _user = await this.userModel.findByPk(id);
        if (!_user) return null;
        return SQZUserMapper.toEntity(_user);
    }

    async create(
        data: CreateUserDto,
    ): Promise<UserEntity | OrganizerEntity | InstitutionEntity> {
        const _user = await this.userModel.create({ ...data });
        return SQZUserMapper.toEntity(_user);
    }

    async registerOrganizerFromOAuth(
        data: UserFromOAuth,
    ): Promise<OrganizerEntity> {
        const _user = await this.userModel.create({
            email: data.email,
            name: data.name,
            role: UserRole.ORGANIZER,
            uid: data.uid,
        });
        return SQZUserMapper.toOrganizerEntity(_user);
    }

    async registerUserFromOAuth(data: UserFromOAuth): Promise<UserEntity> {
        const _user = await this.userModel.create({
            email: data.email,
            name: data.name,
            role: UserRole.USER,
            uid: data.uid,
        });
        return SQZUserMapper.toEntity(_user);
    }

    async updateMfaSettings(
        userId: number,
        data: UpdateMfaDto,
    ): Promise<UserEntity> {
        const _user = await this.userModel.findByPk(userId);
        if (!_user) {
            throw new Error('User not found');
        }

        await _user.update(data);
        return SQZUserMapper.toEntity(_user);
    }
}
