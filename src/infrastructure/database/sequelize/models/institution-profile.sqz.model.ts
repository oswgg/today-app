import {
    Table,
    Column,
    Model,
    DataType,
    ForeignKey,
    BelongsTo,
} from 'sequelize-typescript';
import { UserModel } from './user.model.sqz';

@Table({
    tableName: 'institution_profiles',
    timestamps: false,
})
export class InstitutionProfileModel extends Model {
    @Column({
        type: DataType.BIGINT,
        primaryKey: true,
        autoIncrement: true,
    })
    declare id: bigint;

    @ForeignKey(() => UserModel)
    @Column({
        type: DataType.BIGINT,
        allowNull: false,
        unique: true,
        field: 'userId',
    })
    userId: bigint;

    @Column({
        type: DataType.STRING,
        allowNull: true,
    })
    description: string;

    @Column({
        type: DataType.STRING,
        allowNull: true,
    })
    website: string;

    // Associations
    @BelongsTo(() => UserModel)
    user: UserModel;
}
