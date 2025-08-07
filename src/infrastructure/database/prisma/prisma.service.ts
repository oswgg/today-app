import { Injectable, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from 'src/../generated/prisma';
import {
    QueryOptions,
    Filter,
    IncludeOptions,
} from 'src/application/dtos/shared/query-options.dto';
import { QueryBuilder } from 'src/application/interfaces/query-builder';

type PrismaFindManyArgs = {
    where?: unknown;
    select?: unknown;
    include?: unknown;
    orderBy?: unknown;
    take?: number;
    skip?: number;
};

@Injectable()
export class PrismaService<T, E extends object>
    extends PrismaClient
    implements OnModuleInit, QueryBuilder<T>
{
    constructor() {
        super();
    }

    async onModuleInit() {
        await this.$connect();
    }

    // Return type is Partial<E>, so only valid keys can be used
    buildQuery(query?: QueryOptions<T>): Partial<E> | undefined {
        if (!query) {
            return undefined;
        }

        const prismaQuery: PrismaFindManyArgs = {};

        // where
        if (query.where) {
            // Type: Partial<{ [F in keyof T]: any }>
            const where: Record<string, unknown> = {};
            for (const key in query.where) {
                const value = query.where[key];
                if (value && typeof value === 'object' && 'operator' in value) {
                    const filter = value as Filter;
                    switch (filter.operator) {
                        case 'eq':
                            where[key] = filter.value;
                            break;
                        case 'neq':
                            where[key] = { not: filter.value };
                            break;
                        case 'gt':
                            where[key] = { gt: filter.value };
                            break;
                        case 'gte':
                            where[key] = { gte: filter.value };
                            break;
                        case 'lt':
                            where[key] = { lt: filter.value };
                            break;
                        case 'lte':
                            where[key] = { lte: filter.value };
                            break;
                        case 'in':
                            where[key] = { in: filter.value };
                            break;
                        case 'notIn':
                            where[key] = { notIn: filter.value };
                            break;
                        case 'between':
                            if (
                                Array.isArray(filter.value) &&
                                filter.value.length === 2
                            ) {
                                where[key] = {
                                    gte: filter.value[0] as unknown,
                                    lte: filter.value[1] as unknown,
                                };
                            }
                            break;
                        case 'contains':
                            where[key] = { contains: filter.value };
                            break;
                    }
                } else {
                    where[key] = value;
                }
            }
            prismaQuery.where = where;
        }

        // select
        if (query.select) {
            const selectArr = Array.isArray(query.select)
                ? query.select
                : [query.select];
            prismaQuery.select = Object.fromEntries(
                selectArr.map((field) => [field, true]),
            );
        }

        // orderBy
        if (query.sort) {
            prismaQuery.orderBy = Object.entries(query.sort).map(
                ([field, direction]) => ({
                    [field]: direction,
                }),
            );
        }

        if (query.limit) prismaQuery.take = query.limit;
        if (query.offset) prismaQuery.skip = query.offset;

        if (query.include) {
            prismaQuery.include = this.buildInclude(query.include);
        }

        return prismaQuery as E;
    }

    private buildInclude(include?: IncludeOptions): object | undefined {
        if (!include) return undefined;
        return Object.fromEntries(
            include.map((relation) => [
                relation.model,
                {
                    ...(relation.select
                        ? {
                              select: Object.fromEntries(
                                  relation.select.map((field) => [field, true]),
                              ),
                          }
                        : relation.select === null
                          ? { select: false }
                          : {}),
                    ...(relation.where ? { where: relation.where } : {}),
                    ...(relation.include
                        ? { include: this.buildInclude(relation.include) }
                        : {}),
                },
            ]),
        );
    }
}
