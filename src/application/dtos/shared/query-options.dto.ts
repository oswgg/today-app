export interface QueryOptions<T> {
    where?: Partial<T>;
    sort?: { [F in keyof T]: 'asc' | 'desc' };
    limit?: number;
    offset?: number;
}
