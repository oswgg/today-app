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
    | 'contains'
    | 'or';

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

export type RelationType = 'one' | 'many';

export type IncludeOptions = Array<{
    model: string;
    as?: string;
    select?: string[] | null;
    where?: unknown;
    required?: boolean; // Si true, el where filtra los registros padre (INNER JOIN). Si false/undefined, solo filtra las relaciones (LEFT JOIN)
    relation?: RelationType; // Define si la relación es 'one' (uno-a-uno/muchos-a-uno) o 'many' (uno-a-muchos/muchos-a-muchos)
    include?: IncludeOptions;
}>;
