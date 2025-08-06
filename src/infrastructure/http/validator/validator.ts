export interface Validator<T> {
    validate(this: void, schema: unknown): T;
}
