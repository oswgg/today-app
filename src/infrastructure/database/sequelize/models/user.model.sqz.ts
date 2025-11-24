import {
    Table,
    Column,
    Model,
    DataType,
    HasOne,
    HasMany,
} from 'sequelize-typescript';
import { OrganizerProfileModel } from './organizer-profile.model.sqz';
import { InstitutionProfileModel } from './institution-profile.sqz.model';
import { EventModel } from './event.model.sqz';
import { LocationModel } from './location.model.sqz';

export enum UserRole {
    USER = 'USER',
    ORGANIZER = 'ORGANIZER',
    INSTITUTION = 'INSTITUTION',
}

@Table({
    tableName: 'users',
    timestamps: false,
})
export class UserModel extends Model {
    @Column({
        type: DataType.BIGINT,
        primaryKey: true,
        autoIncrement: true,
    })
    declare id: bigint;

    @Column({
        type: DataType.STRING,
        allowNull: false,
    })
    declare name: string;

    @Column({
        type: DataType.STRING,
        allowNull: false,
        unique: true,
    })
    declare email: string;

    @Column({
        type: DataType.ENUM(...Object.values(UserRole)),
        allowNull: false,
        defaultValue: UserRole.USER,
    })
    declare role: UserRole;

    @Column({
        type: DataType.DATE,
        allowNull: false,
        defaultValue: DataType.NOW,
        field: 'created_at',
    })
    declare createdAt: Date;

    @Column({
        type: DataType.STRING,
        allowNull: true,
    })
    uid: string;

    @Column({
        type: DataType.BOOLEAN,
        allowNull: false,
        defaultValue: false,
        field: 'mfa_enabled',
    })
    declare mfaEnabled: boolean;

    @Column({
        type: DataType.STRING,
        allowNull: true,
        field: 'mfa_factor_id',
    })
    declare mfaFactorId: string;

    @Column({
        type: DataType.BOOLEAN,
        allowNull: false,
        defaultValue: false,
        field: 'mfa_required',
    })
    declare mfaRequired: boolean;

    // Associations
    @HasOne(() => OrganizerProfileModel, 'userId')
    organizerProfile: OrganizerProfileModel;

    @HasOne(() => InstitutionProfileModel, 'userId')
    institutionProfile: InstitutionProfileModel;

    @HasMany(() => EventModel, 'creatorId')
    createdEvents: EventModel[];

    @HasMany(() => LocationModel, 'creatorId')
    createdLocations: LocationModel[];
}
