import { QueryOptions } from '../dtos/shared/query-options.dto';

export interface QueryBuilder<T> {
    buildQuery(query: QueryOptions<T> | undefined): any;
}
