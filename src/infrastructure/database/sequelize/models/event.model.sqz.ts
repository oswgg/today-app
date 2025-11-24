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
import { LocationModel } from './location.model.sqz';
import { EventCategoriesModel } from './event-categories.sqz.model';

@Table({
    tableName: 'events',
    timestamps: false,
})
export class EventModel extends Model {
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
    title: string;

    @Column({
        type: DataType.STRING,
        allowNull: true,
    })
    description: string;

    @Column({
        type: DataType.DATE,
        allowNull: false,
        field: 'start_time',
    })
    startTime: Date;

    @Column({
        type: DataType.DATE,
        allowNull: true,
        field: 'end_time',
    })
    endTime: Date;

    @Column({
        type: DataType.STRING,
        allowNull: true,
    })
    location: string;

    @Column({
        type: DataType.DOUBLE,
        allowNull: true,
    })
    lat: number;

    @Column({
        type: DataType.DOUBLE,
        allowNull: true,
    })
    lng: number;

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
        field: 'image_url',
    })
    imageUrl: string;

    @ForeignKey(() => LocationModel)
    @Column({
        type: DataType.BIGINT,
        allowNull: true,
        field: 'location_id',
    })
    locationId: bigint;

    @ForeignKey(() => UserModel)
    @Column({
        type: DataType.BIGINT,
        allowNull: false,
        field: 'creator_id',
    })
    creatorId: bigint;

    // Associations
    @BelongsTo(() => UserModel, 'creatorId')
    creator: UserModel;

    @BelongsTo(() => LocationModel, 'locationId')
    locationRef: LocationModel;

    @HasMany(() => EventCategoriesModel, 'eventId')
    categories: EventCategoriesModel[];
}
