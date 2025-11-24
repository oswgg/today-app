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
    tableName: 'organizer_profiles',
    timestamps: false,
})
export class OrganizerProfileModel extends Model {
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

    // Associations
    @BelongsTo(() => UserModel)
    user: UserModel;
}
