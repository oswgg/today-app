export type FilterOperator =
    | 'eq'
    | 'neq'
    | 'gt'
    | 'lt'
    | 'gte'
    | 'lte'
    | 'in'
    | 'notIn'
    | 'between'
    | 'contains';

export interface Filter<T = any> {
    field?: keyof T;
    operator: FilterOperator;
    value: unknown;
}

export interface QueryOptions<T> {
    select?: (keyof T)[];
    where?: Partial<{ [F in keyof T]: Filter<T[F]> | T[F] }>;
    sort?: Partial<{ [F in keyof T]: 'asc' | 'desc' }>;
    limit?: number;
    offset?: number;
    include?: IncludeOptions;
}

export type IncludeOptions = Array<{
    model: string;
    as?: string;
    select?: string[] | null;
    where?: unknown;
    include?: IncludeOptions;
}>;
