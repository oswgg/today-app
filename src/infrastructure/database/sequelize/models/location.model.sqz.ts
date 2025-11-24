import {
    Table,
    Column,
    Model,
    DataType,
    ForeignKey,
    BelongsTo,
    HasMany,
} from 'sequelize-typescript';
import { UserModel } from './user.model.sqz';
import { EventModel } from './event.model.sqz';

@Table({
    tableName: 'locations',
    timestamps: false,
})
export class LocationModel extends Model {
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
    name: string;

    @Column({
        type: DataType.STRING,
        allowNull: false,
    })
    address: string;

    @Column({
        type: DataType.STRING,
        allowNull: false,
    })
    city: string;

    @Column({
        type: DataType.DOUBLE,
        allowNull: false,
    })
    lat: number;

    @Column({
        type: DataType.DOUBLE,
        allowNull: false,
    })
    lng: number;

    @Column({
        type: DataType.STRING,
        allowNull: true,
    })
    description: string;

    @Column({
        type: DataType.STRING,
        allowNull: true,
    })
    phone: string;

    @Column({
        type: DataType.STRING,
        allowNull: true,
    })
    email: string;

    @Column({
        type: DataType.STRING,
        allowNull: true,
    })
    website: string;

    @Column({
        type: DataType.STRING,
        allowNull: true,
        field: 'image_url',
    })
    imageUrl: string;

    @ForeignKey(() => UserModel)
    @Column({
        type: DataType.BIGINT,
        allowNull: false,
        field: 'creator_id',
    })
    creatorId: bigint;

    @Column({
        type: DataType.DATE,
        allowNull: false,
        defaultValue: DataType.NOW,
        field: 'created_at',
    })
    declare createdAt: Date;

    // Associations
    @BelongsTo(() => UserModel, 'creatorId')
    creator: UserModel;

    @HasMany(() => EventModel, 'locationId')
    events: EventModel[];
}
