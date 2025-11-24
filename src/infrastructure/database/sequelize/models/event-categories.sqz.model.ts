import {
    Table,
    Column,
    Model,
    DataType,
    ForeignKey,
    BelongsTo,
} from 'sequelize-typescript';
import { EventModel } from './event.model.sqz';
import { CategoryModel } from './category.sqz.model';

@Table({
    tableName: 'event_categories',
    timestamps: false,
})
export class EventCategoriesModel extends Model {
    @Column({
        type: DataType.BIGINT,
        primaryKey: true,
        autoIncrement: true,
    })
    declare id: bigint;

    @ForeignKey(() => EventModel)
    @Column({
        type: DataType.BIGINT,
        allowNull: false,
        field: 'event_id',
    })
    eventId: bigint;

    @ForeignKey(() => CategoryModel)
    @Column({
        type: DataType.BIGINT,
        allowNull: false,
        field: 'category_id',
    })
    categoryId: bigint;

    // Associations
    @BelongsTo(() => EventModel, 'eventId')
    event: EventModel;

    @BelongsTo(() => CategoryModel, 'categoryId')
    category: CategoryModel;
}
