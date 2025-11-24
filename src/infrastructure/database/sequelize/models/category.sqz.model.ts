import { Table, Column, Model, DataType, HasMany } from 'sequelize-typescript';
import { EventCategoriesModel } from './event-categories.sqz.model';

@Table({
    tableName: 'categories',
    timestamps: false,
})
export class CategoryModel extends Model {
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
        allowNull: true,
    })
    description: string;

    @Column({
        type: DataType.DATE,
        allowNull: false,
        defaultValue: DataType.NOW,
        field: 'created_at',
    })
    declare createdAt: Date;

    // Associations
    @HasMany(() => EventCategoriesModel, 'categoryId')
    eventCategories: EventCategoriesModel[];
}
