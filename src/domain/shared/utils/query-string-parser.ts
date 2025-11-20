import {
    Filter,
    FilterOperator,
    QueryOptions,
} from 'src/application/dtos/shared/query-options.dto';

/**
 * Parses a query string into QueryOptions
 *
 * Format: ?q=where[field=op[value],field2=op[value]]order[field=asc,field2=desc]limit[10]offset[0]
 *
 * Examples:
 * - ?q=where[creator_id=eq[1],location_id=in[1,2,3]]order[created_at=desc]limit[10]
 *   -> { where: {...}, sort: { created_at: 'desc' }, limit: 10 }
 * - ?q=where[location_id=or[1],creator_id=eq[1]]offset[10]limit[20]
 *   -> { where: {...}, offset: 10, limit: 20 }
 *
 * Supported operators: eq, neq, gt, lt, gte, lte, in, notIn, between, contains, or
 */
export class QueryStringParser {
    private static readonly VALID_OPERATORS: FilterOperator[] = [
        'eq',
        'neq',
        'gt',
        'lt',
        'gte',
        'lte',
        'in',
        'notIn',
        'between',
        'contains',
        'or',
    ];

    /**
     * Parse a query string into QueryOptions
     * @param queryString - The full query string (e.g., "where[creator_id=eq[1]]&order[created_at=desc]&limit=10")
     * @param allowedFields - Optional whitelist of allowed fields for where clause
     * @returns Object with QueryOptions and rejected fields
     */
    static parse<T>(
        queryString: string | undefined,
        allowedFields?: Array<keyof T>,
    ): { filters?: QueryOptions<T>; rejectedFields: string[] } {
        if (!queryString || queryString.trim() === '') {
            return { rejectedFields: [] };
        }

        const result: QueryOptions<T> = {};
        const rejectedFields: string[] = [];

        // Parse where clause
        const whereSection = this.extractSection(queryString, 'where');
        if (whereSection) {
            const { where, rejected } = this.parseWhere<T>(
                whereSection,
                allowedFields,
            );
            if (where && Object.keys(where).length > 0) {
                result.where = where;
            }
            rejectedFields.push(...rejected);
        }

        // Parse order clause
        const orderSection = this.extractSection(queryString, 'order');
        if (orderSection) {
            const sort = this.parseOrder<T>(orderSection);
            if (sort && Object.keys(sort).length > 0) {
                result.sort = sort;
            }
        }

        // Parse limit (supports both limit[10] and limit=10)
        const limitMatch = queryString.match(/limit\[(\d+)\]|limit=(\d+)/);
        if (limitMatch) {
            result.limit = parseInt(limitMatch[1] || limitMatch[2], 10);
        }

        // Parse offset (supports both offset[10] and offset=10)
        const offsetMatch = queryString.match(/offset\[(\d+)\]|offset=(\d+)/);
        if (offsetMatch) {
            result.offset = parseInt(offsetMatch[1] || offsetMatch[2], 10);
        }

        // Return undefined filters if no valid options were parsed
        if (Object.keys(result).length === 0) {
            return { rejectedFields };
        }

        return {
            filters: result,
            rejectedFields,
        };
    }

    /**
     * Extract a section from query string (e.g., "where[...]" -> "...")
     * Supports both &section[...] and section[...] (continuous format)
     */
    private static extractSection(
        queryString: string,
        section: string,
    ): string | null {
        if (section === 'where') {
            return (
                queryString.match(/where\[((?:[^\[\]]|\[[^\]]*\])*)\]/)?.[1] ||
                null
            );
        }
        const regex = new RegExp(`${section}\\[([^\\]]+)\\]`);
        const match = queryString.match(regex);
        return match ? match[1] : null;
    }

    /**
     * Parse where clause
     */
    private static parseWhere<T>(
        whereString: string,
        allowedFields?: Array<keyof T>,
    ): {
        where?: Partial<{ [F in keyof T]: Filter | T[F] }>;
        rejected: string[];
    } {
        // Split conditions by comma, but only if not inside brackets
        const conditions = this.splitConditions(whereString);
        const where: Record<string, Filter | unknown> = {};
        const rejected: string[] = [];

        for (const condition of conditions) {
            const parsed = this.parseCondition(condition.trim());
            if (parsed) {
                // Check if field is in whitelist (if provided)
                if (
                    allowedFields &&
                    !allowedFields.includes(parsed.field as keyof T)
                ) {
                    rejected.push(parsed.field);
                    continue;
                }

                where[parsed.field] = parsed.filter;
            }
        }

        return {
            where:
                Object.keys(where).length > 0
                    ? (where as Partial<{ [F in keyof T]: Filter | T[F] }>)
                    : undefined,
            rejected,
        };
    }

    /**
     * Parse order clause (e.g., "field1=asc,field2=desc")
     */
    private static parseOrder<T>(
        orderString: string,
    ): Partial<{ [F in keyof T]: 'asc' | 'desc' }> | undefined {
        const entries = orderString.split(',').map((e) => e.trim());
        const sort: Record<string, 'asc' | 'desc'> = {};

        for (const entry of entries) {
            const [field, direction] = entry.split('=');
            if (
                field &&
                direction &&
                (direction === 'asc' || direction === 'desc')
            ) {
                sort[field.trim()] = direction;
            }
        }

        return Object.keys(sort).length > 0
            ? (sort as Partial<{ [F in keyof T]: 'asc' | 'desc' }>)
            : undefined;
    }

    /**
     * Split conditions by comma, but only if comma is not inside brackets
     * Example: "creator_id=eq[1],location_id=in[1,2,3]" -> ["creator_id=eq[1]", "location_id=in[1,2,3]"]
     */
    private static splitConditions(whereString: string): string[] {
        const conditions: string[] = [];
        let current = '';
        let bracketDepth = 0;

        for (let i = 0; i < whereString.length; i++) {
            const char = whereString[i];

            if (char === '[') {
                bracketDepth++;
                current += char;
            } else if (char === ']') {
                bracketDepth--;
                current += char;
            } else if (char === ',' && bracketDepth === 0) {
                // Comma outside brackets - this is a separator
                if (current.trim()) {
                    conditions.push(current.trim());
                }
                current = '';
            } else {
                current += char;
            }
        }

        // Add the last condition
        if (current.trim()) {
            conditions.push(current.trim());
        }

        return conditions;
    }

    /**
     * Parse a single condition (field=operator[value])
     */
    private static parseCondition(condition: string): {
        field: string;
        filter: Filter;
    } | null {
        // Match pattern: field=operator[value]
        // The value part can contain commas, so we need to match everything inside brackets
        const match = condition.match(
            /^([a-zA-Z_][a-zA-Z0-9_]*)=([a-z]+)\[([^\]]+)\]$/,
        );

        if (!match) {
            return null;
        }

        const [, field, operator, valueStr] = match;

        // Validate operator
        if (!this.VALID_OPERATORS.includes(operator as FilterOperator)) {
            console.warn(`Invalid operator: ${operator}`);
            return null;
        }

        // Parse value
        const value = this.parseValue(valueStr, operator as FilterOperator);

        return {
            field,
            filter: {
                operator: operator as FilterOperator,
                value,
            },
        };
    }

    /**
     * Parse value based on the operator
     */
    private static parseValue(
        valueStr: string,
        operator: FilterOperator,
    ): unknown {
        // For 'in', 'notIn', 'or', and 'between' operators, parse as array
        if (['in', 'notIn', 'between', 'or'].includes(operator)) {
            return valueStr
                .split(',')
                .map((v) => this.parseScalarValue(v.trim()));
        }

        // For other operators, parse as scalar
        return this.parseScalarValue(valueStr);
    }

    /**
     * Parse a scalar value (string, number, boolean, null)
     */
    private static parseScalarValue(
        value: string,
    ): string | number | boolean | null {
        // null
        if (value === 'null') {
            return null;
        }

        // boolean
        if (value === 'true') {
            return true;
        }
        if (value === 'false') {
            return false;
        }

        // number
        if (/^-?\d+(\.\d+)?$/.test(value)) {
            return parseFloat(value);
        }

        // string (remove quotes if present)
        if (
            (value.startsWith('"') && value.endsWith('"')) ||
            (value.startsWith("'") && value.endsWith("'"))
        ) {
            return value.slice(1, -1);
        }

        return value;
    }
}
