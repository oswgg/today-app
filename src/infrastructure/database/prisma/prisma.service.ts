import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
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
    implements OnModuleInit, OnModuleDestroy, QueryBuilder<T>
{
    constructor() {
        super();
    }

    async onModuleInit() {
        await this.$connect();
    }

    async onModuleDestroy() {
        await this.$disconnect();
    }

    // Return type is Partial<E>, so only valid keys can be used
    buildQuery(query?: QueryOptions<T>): Partial<E> | undefined {
        if (!query) {
            return undefined;
        }

        const prismaQuery: PrismaFindManyArgs = {};

        // where
        let whereClause: Record<string, unknown> = {};
        if (query.where) {
            whereClause = this.buildWhereClause(query.where);

            // Extract nested relation filters and convert them to 'some' queries
            whereClause =
                this.convertNestedFiltersToRelationFilters(whereClause);
        }

        // Handle required includes - move their where conditions to main where
        if (query.include) {
            const requiredFilters = this.extractRequiredFilters(query.include);
            if (Object.keys(requiredFilters).length > 0) {
                whereClause = { ...whereClause, ...requiredFilters };
            }
        }

        if (Object.keys(whereClause).length > 0) {
            prismaQuery.where = whereClause;
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

    /**
     * Convert nested object filters to Prisma relation filters using 'some'
     * Example: { categories: { id: { in: [1] } } }
     * -> { categories: { some: { id: { in: [1] } } } }
     *
     * By default, assumes 'many' relations (uses 'some')
     */
    private convertNestedFiltersToRelationFilters(
        where: Record<string, unknown>,
    ): Record<string, unknown> {
        const result: Record<string, unknown> = {};

        for (const [key, value] of Object.entries(where)) {
            if (value && typeof value === 'object' && !('operator' in value)) {
                // This might be a nested relation filter
                // Check if it contains filter operators or nested objects
                if (this.isNestedRelationFilter(value)) {
                    // By default, wrap in 'some' for array relations
                    // This is a fallback when no explicit include with relation type is provided
                    result[key] = {
                        some: value,
                    };
                } else {
                    result[key] = value;
                }
            } else {
                result[key] = value;
            }
        }

        return result;
    }

    /**
     * Check if an object represents a nested relation filter
     * (contains fields that look like filter conditions)
     */
    private isNestedRelationFilter(obj: unknown): boolean {
        if (!obj || typeof obj !== 'object') {
            return false;
        }

        // Check if any value in the object has filter-like properties
        for (const value of Object.values(obj)) {
            if (value && typeof value === 'object') {
                // Has Prisma filter operators (in, not, gt, etc.)
                if (
                    'in' in value ||
                    'not' in value ||
                    'gt' in value ||
                    'lt' in value ||
                    'gte' in value ||
                    'lte' in value ||
                    'contains' in value ||
                    'notIn' in value
                ) {
                    return true;
                }
            }
        }

        return false;
    }

    private extractRequiredFilters(
        include: IncludeOptions,
        parentPath: string[] = [],
    ): Record<string, unknown> {
        const filters: Record<string, unknown> = {};

        for (const relation of include) {
            // Check if this relation or any nested relation has required filters
            const nestedRequired = this.findRequiredInPath(
                relation.include || [],
            );

            if (nestedRequired) {
                // Build the complete where condition for this path
                if (parentPath.length === 0) {
                    // At root level: use 'some' only if relation is 'many'
                    const nestedWhere = this.buildNestedRequiredWhere(
                        relation.include || [],
                    );

                    // Default to 'many' if relation type not specified
                    const relationType = relation.relation || 'many';

                    filters[relation.model] =
                        relationType === 'many'
                            ? { some: nestedWhere }
                            : nestedWhere;
                }
            } else if (relation.required && relation.where) {
                // This level has the required filter
                const whereCondition = this.buildWhereClause(relation.where);

                if (parentPath.length === 0) {
                    // Default to 'many' if relation type not specified
                    const relationType = relation.relation || 'many';

                    filters[relation.model] =
                        relationType === 'many'
                            ? { some: whereCondition }
                            : whereCondition;
                }
            }
        }

        return filters;
    }

    /**
     * Check if there's any required filter in the nested includes
     */
    private findRequiredInPath(includes: IncludeOptions): boolean {
        for (const include of includes) {
            if (include.required && include.where) {
                return true;
            }
            if (include.include && this.findRequiredInPath(include.include)) {
                return true;
            }
        }
        return false;
    }

    /**
     * Build nested where conditions for required filters
     * This recursively builds the path until it finds the required filter
     * Uses the 'relation' property to determine whether to use 'some' or direct filtering
     */
    private buildNestedRequiredWhere(
        includes: IncludeOptions,
    ): Record<string, unknown> {
        for (const include of includes) {
            if (include.required && include.where) {
                // Found the required filter - return it directly
                // (no 'some' here since parent will handle it based on parent's relation type)
                return {
                    [include.model]: this.buildWhereClause(include.where),
                };
            } else if (include.include) {
                // Keep nesting deeper
                const nested = this.buildNestedRequiredWhere(include.include);
                if (Object.keys(nested).length > 0) {
                    return {
                        [include.model]: nested,
                    };
                }
            }
        }
        return {};
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
                    // Only add where to include if it's not required (not moved to main where)
                    ...(relation.where && !relation.required
                        ? { where: this.buildWhereClause(relation.where) }
                        : {}),
                    ...(relation.include
                        ? { include: this.buildInclude(relation.include) }
                        : {}),
                },
            ]),
        );
    }

    private buildWhereClause(where: unknown): Record<string, unknown> {
        if (!where || typeof where !== 'object') {
            return where as Record<string, unknown>;
        }

        const result: Record<string, unknown> = {};
        for (const [key, value] of Object.entries(where)) {
            if (value && typeof value === 'object' && 'operator' in value) {
                const filter = value as Filter;
                switch (filter.operator) {
                    case 'eq':
                        result[key] = filter.value;
                        break;
                    case 'neq':
                        result[key] = { not: filter.value };
                        break;
                    case 'gt':
                        result[key] = { gt: filter.value };
                        break;
                    case 'gte':
                        result[key] = { gte: filter.value };
                        break;
                    case 'lt':
                        result[key] = { lt: filter.value };
                        break;
                    case 'lte':
                        result[key] = { lte: filter.value };
                        break;
                    case 'in':
                        result[key] = { in: filter.value };
                        break;
                    case 'notIn':
                        result[key] = { notIn: filter.value };
                        break;
                    case 'or':
                        result[key] = { in: filter.value };
                        break;
                    case 'between':
                        if (
                            Array.isArray(filter.value) &&
                            filter.value.length === 2
                        ) {
                            result[key] = {
                                gte: filter.value[0] as unknown,
                                lte: filter.value[1] as unknown,
                            };
                        }
                        break;
                    case 'contains':
                        result[key] = { contains: filter.value };
                        break;
                }
            } else {
                result[key] = value;
            }
        }
        return result;
    }
}
