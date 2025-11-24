import { Injectable } from '@nestjs/common';
import { Sequelize, Op, WhereOptions, FindOptions, Includeable } from 'sequelize';
import {
    QueryOptions,
    Filter,
    IncludeOptions,
} from 'src/application/dtos/shared/query-options.dto';
import { QueryBuilder } from 'src/application/interfaces/query-builder';

type SequelizeFindOptions = FindOptions & {
    where?: WhereOptions;
    attributes?: string[];
    include?: Includeable[];
    order?: Array<[string, 'ASC' | 'DESC']>;
    limit?: number;
    offset?: number;
};

@Injectable()
export class SequelizeService<T, E extends SequelizeFindOptions = SequelizeFindOptions>
    implements QueryBuilder<T>
{
    constructor(protected readonly sequelize: Sequelize) {}

    // Translates QueryOptions to Sequelize FindOptions
    buildQuery(query?: QueryOptions<T>): Partial<E> | undefined {
        if (!query) {
            return undefined;
        }

        const sequelizeQuery: SequelizeFindOptions = {};

        // where clause
        if (query.where) {
            const where: WhereOptions = {};
            for (const key in query.where) {
                const value = query.where[key];
                if (value && typeof value === 'object' && 'operator' in value) {
                    const filter = value as Filter;
                    switch (filter.operator) {
                        case 'eq':
                            where[key] = filter.value;
                            break;
                        case 'neq':
                            where[key] = { [Op.ne]: filter.value };
                            break;
                        case 'gt':
                            where[key] = { [Op.gt]: filter.value };
                            break;
                        case 'gte':
                            where[key] = { [Op.gte]: filter.value };
                            break;
                        case 'lt':
                            where[key] = { [Op.lt]: filter.value };
                            break;
                        case 'lte':
                            where[key] = { [Op.lte]: filter.value };
                            break;
                        case 'in':
                            where[key] = { [Op.in]: filter.value as any[] };
                            break;
                        case 'notIn':
                            where[key] = { [Op.notIn]: filter.value as any[] };
                            break;
                        case 'or':
                            // 'or' operator works like 'in' in Sequelize
                            where[key] = { [Op.in]: filter.value as any[] };
                            break;
                        case 'between':
                            if (
                                Array.isArray(filter.value) &&
                                filter.value.length === 2
                            ) {
                                where[key] = {
                                    [Op.between]: [filter.value[0], filter.value[1]],
                                };
                            }
                            break;
                        case 'contains':
                            where[key] = { [Op.like]: `%${filter.value}%` };
                            break;
                    }
                } else {
                    where[key] = value;
                }
            }
            sequelizeQuery.where = where;
        }

        // attributes (select)
        if (query.select) {
            const selectArr = Array.isArray(query.select)
                ? query.select
                : [query.select];
            sequelizeQuery.attributes = selectArr.map(String);
        }

        // order (sort)
        if (query.sort) {
            sequelizeQuery.order = Object.entries(query.sort).map(
                ([field, direction]) => [
                    field,
                    (direction as string).toUpperCase() as 'ASC' | 'DESC',
                ],
            );
        }

        // pagination
        if (query.limit) sequelizeQuery.limit = query.limit;
        if (query.offset) sequelizeQuery.offset = query.offset;

        // include (relations)
        if (query.include) {
            sequelizeQuery.include = this.buildInclude(query.include);
        }

        return sequelizeQuery as E;
    }

    private buildInclude(include?: IncludeOptions): Includeable[] | undefined {
        if (!include) return undefined;

        return include.map((relation) => {
            const includeObj: any = {
                association: relation.model,
                ...(relation.as ? { as: relation.as } : {}),
            };

            // Handle select
            if (relation.select) {
                includeObj.attributes = relation.select;
            } else if (relation.select === null) {
                includeObj.attributes = [];
            }

            // Handle where
            if (relation.where) {
                includeObj.where = relation.where;
            }

            // Handle nested includes
            if (relation.include) {
                includeObj.include = this.buildInclude(relation.include);
            }

            return includeObj;
        });
    }

    /**
     * Helper method to get Sequelize operators
     * Can be used by repositories for advanced queries
     */
    get operators(): typeof Op {
        return Op;
    }
}

