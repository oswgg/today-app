import { QueryStringParser } from '../query-string-parser';

describe('QueryStringParser', () => {
    describe('parse - where conditions', () => {
        it('should parse simple equality condition', () => {
            const { filters, rejectedFields } =
                QueryStringParser.parse('where[creator_id=eq[1]]');

            expect(filters).toEqual({
                where: {
                    creator_id: {
                        operator: 'eq',
                        value: 1,
                    },
                },
            });
            expect(rejectedFields).toEqual([]);
        });

        it('should parse multiple AND conditions', () => {
            const { filters, rejectedFields } = QueryStringParser.parse(
                'where[creator_id=eq[1],location_id=in[1,2,3]]',
            );

            expect(filters).toEqual({
                where: {
                    creator_id: {
                        operator: 'eq',
                        value: 1,
                    },
                    location_id: {
                        operator: 'in',
                        value: [1, 2, 3],
                    },
                },
            });
            expect(rejectedFields).toEqual([]);
        });

        it('should parse string values', () => {
            const { filters } = QueryStringParser.parse('where[name=contains[test]]');

            expect(filters).toEqual({
                where: {
                    name: {
                        operator: 'contains',
                        value: 'test',
                    },
                },
            });
        });

        it('should parse between operator', () => {
            const { filters } = QueryStringParser.parse(
                'where[price=between[10,100]]',
            );

            expect(filters).toEqual({
                where: {
                    price: {
                        operator: 'between',
                        value: [10, 100],
                    },
                },
            });
        });

        it('should parse comparison operators', () => {
            const { filters } = QueryStringParser.parse(
                'where[age=gte[18],score=lt[100]]',
            );

            expect(filters).toEqual({
                where: {
                    age: {
                        operator: 'gte',
                        value: 18,
                    },
                    score: {
                        operator: 'lt',
                        value: 100,
                    },
                },
            });
        });

        it('should parse or operator', () => {
            const { filters } = QueryStringParser.parse(
                'where[location_id=or[1,2,3]]',
            );

            expect(filters).toEqual({
                where: {
                    location_id: {
                        operator: 'or',
                        value: [1, 2, 3],
                    },
                },
            });
        });
    });

    describe('parse - order', () => {
        it('should parse single order field', () => {
            const { filters } = QueryStringParser.parse('order[created_at=desc]');

            expect(filters).toEqual({
                sort: {
                    created_at: 'desc',
                },
            });
        });

        it('should parse multiple order fields', () => {
            const { filters } = QueryStringParser.parse(
                'order[priority=desc,created_at=asc]',
            );

            expect(filters).toEqual({
                sort: {
                    priority: 'desc',
                    created_at: 'asc',
                },
            });
        });
    });

    describe('parse - limit and offset', () => {
        it('should parse limit with bracket notation', () => {
            const { filters } = QueryStringParser.parse('limit[10]');

            expect(filters).toEqual({
                limit: 10,
            });
        });

        it('should parse offset with bracket notation', () => {
            const { filters } = QueryStringParser.parse('offset[20]');

            expect(filters).toEqual({
                offset: 20,
            });
        });

        it('should parse both limit and offset with bracket notation', () => {
            const { filters } = QueryStringParser.parse('limit[10]offset[20]');

            expect(filters).toEqual({
                limit: 10,
                offset: 20,
            });
        });

        it('should parse limit with query param notation', () => {
            const { filters } = QueryStringParser.parse('limit=10');

            expect(filters).toEqual({
                limit: 10,
            });
        });

        it('should parse both notations with &', () => {
            const { filters } = QueryStringParser.parse('limit=10&offset=20');

            expect(filters).toEqual({
                limit: 10,
                offset: 20,
            });
        });
    });

    describe('parse - select', () => {
        it('should parse single field', () => {
            const { filters } = QueryStringParser.parse('select[id]');

            expect(filters).toEqual({
                select: ['id'],
            });
        });

        it('should parse multiple fields', () => {
            const { filters } = QueryStringParser.parse('select[id,name,email]');

            expect(filters).toEqual({
                select: ['id', 'name', 'email'],
            });
        });
    });

    describe('parse - include', () => {
        it('should parse single relation', () => {
            const { filters } = QueryStringParser.parse('include[creator]');

            expect(filters).toEqual({
                include: [{ model: 'creator' }],
            });
        });

        it('should parse multiple relations', () => {
            const { filters } = QueryStringParser.parse('include[creator,location]');

            expect(filters).toEqual({
                include: [{ model: 'creator' }, { model: 'location' }],
            });
        });
    });

    describe('parse - combined query', () => {
        it('should parse all sections together with & separators', () => {
            const { filters } = QueryStringParser.parse(
                'where[creator_id=eq[1],status=in[active,pending]]&order[created_at=desc]&limit=10&offset=0&select[id,title,status]&include[creator,location]',
            );

            expect(filters).toEqual({
                where: {
                    creator_id: {
                        operator: 'eq',
                        value: 1,
                    },
                    status: {
                        operator: 'in',
                        value: ['active', 'pending'],
                    },
                },
                sort: {
                    created_at: 'desc',
                },
                limit: 10,
                offset: 0,
                select: ['id', 'title', 'status'],
                include: [{ model: 'creator' }, { model: 'location' }],
            });
        });

        it('should parse continuous format without & separators', () => {
            const { filters } = QueryStringParser.parse(
                'where[location_id=or[1],creator_id=eq[1]]offset[10]limit[20]',
            );

            expect(filters).toEqual({
                where: {
                    location_id: {
                        operator: 'or',
                        value: [1],
                    },
                    creator_id: {
                        operator: 'eq',
                        value: 1,
                    },
                },
                offset: 10,
                limit: 20,
            });
        });

        it('should work with URL-style query string', () => {
            const { filters } = QueryStringParser.parse(
                '?where[location_id=or[1,2,3]]order[start_time=asc]limit[20]',
            );

            expect(filters).toEqual({
                where: {
                    location_id: {
                        operator: 'or',
                        value: [1, 2, 3],
                    },
                },
                sort: {
                    start_time: 'asc',
                },
                limit: 20,
            });
        });

        it('should parse complex continuous query', () => {
            const { filters } = QueryStringParser.parse(
                'where[creator_id=eq[1],status=in[active,pending]]order[created_at=desc,priority=asc]limit[10]offset[0]select[id,title]include[creator]',
            );

            expect(filters).toEqual({
                where: {
                    creator_id: {
                        operator: 'eq',
                        value: 1,
                    },
                    status: {
                        operator: 'in',
                        value: ['active', 'pending'],
                    },
                },
                sort: {
                    created_at: 'desc',
                    priority: 'asc',
                },
                limit: 10,
                offset: 0,
                select: ['id', 'title'],
                include: [{ model: 'creator' }],
            });
        });
    });
    });

    describe('parseValue types', () => {
        it('should parse numbers', () => {
            const { filters } = QueryStringParser.parse('where[id=eq[123]]');
            expect(filters?.where).toHaveProperty('id');
            expect((filters?.where as any).id.value).toBe(123);
        });

        it('should parse floats', () => {
            const { filters } = QueryStringParser.parse('where[price=eq[99.99]]');
            expect((filters?.where as any).price.value).toBe(99.99);
        });

        it('should parse booleans', () => {
            const { filters } = QueryStringParser.parse(
                'where[active=eq[true],deleted=eq[false]]',
            );
            expect((filters?.where as any).active.value).toBe(true);
            expect((filters?.where as any).deleted.value).toBe(false);
        });

        it('should parse null', () => {
            const { filters } = QueryStringParser.parse('where[parent_id=eq[null]]');
            expect((filters?.where as any).parent_id.value).toBe(null);
        });

        it('should parse quoted strings', () => {
            const { filters } = QueryStringParser.parse('where[name=eq["John Doe"]]');
            expect((filters?.where as any).name.value).toBe('John Doe');
        });

        it('should parse arrays for in operator', () => {
            const { filters } = QueryStringParser.parse(
                'where[status=in[active,pending,completed]]',
            );
            expect((filters?.where as any).status.value).toEqual([
                'active',
                'pending',
                'completed',
            ]);
        });
    });

    describe('whitelist allowed fields', () => {
        interface TestEntity {
            creator_id: number;
            location_id: number;
            status: string;
            secret_field: string;
        }

        it('should only parse allowed fields when whitelist is provided', () => {
            const { filters, rejectedFields } =
                QueryStringParser.parse<TestEntity>(
                    'where[creator_id=eq[1],location_id=in[1,2,3],secret_field=eq[hack]]',
                    ['creator_id', 'location_id'],
                );

            expect(filters).toEqual({
                where: {
                    creator_id: {
                        operator: 'eq',
                        value: 1,
                    },
                    location_id: {
                        operator: 'in',
                        value: [1, 2, 3],
                    },
                    // secret_field should not be included
                },
            });
            expect(rejectedFields).toEqual(['secret_field']);
        });

        it('should parse all fields when no whitelist is provided', () => {
            const { filters, rejectedFields } =
                QueryStringParser.parse<TestEntity>(
                    'where[creator_id=eq[1],secret_field=eq[value]]',
                );

            expect(filters).toEqual({
                where: {
                    creator_id: {
                        operator: 'eq',
                        value: 1,
                    },
                    secret_field: {
                        operator: 'eq',
                        value: 'value',
                    },
                },
            });
            expect(rejectedFields).toEqual([]);
        });

        it('should return undefined filters when no allowed fields match', () => {
            const { filters, rejectedFields } =
                QueryStringParser.parse<TestEntity>('where[secret_field=eq[hack]]', [
                    'creator_id',
                    'location_id',
                ]);

            expect(filters).toBeUndefined();
            expect(rejectedFields).toEqual(['secret_field']);
        });
    });

    describe('edge cases', () => {
        it('should return empty result for empty string', () => {
            const { filters, rejectedFields } = QueryStringParser.parse('');
            expect(filters).toBeUndefined();
            expect(rejectedFields).toEqual([]);
        });

        it('should return empty result for undefined', () => {
            const { filters, rejectedFields } =
                QueryStringParser.parse(undefined);
            expect(filters).toBeUndefined();
            expect(rejectedFields).toEqual([]);
        });

        it('should handle whitespace in where clause', () => {
            const { filters } = QueryStringParser.parse(
                'where[  creator_id=eq[1] , location_id=in[1,2,3]  ]',
            );
            expect(filters).toEqual({
                where: {
                    creator_id: {
                        operator: 'eq',
                        value: 1,
                    },
                    location_id: {
                        operator: 'in',
                        value: [1, 2, 3],
                    },
                },
            });
        });

        it('should skip invalid conditions', () => {
            const { filters } = QueryStringParser.parse(
                'where[creator_id=eq[1],invalid_format,location_id=in[1,2]]',
            );

            expect(filters).toEqual({
                where: {
                    creator_id: {
                        operator: 'eq',
                        value: 1,
                    },
                    location_id: {
                        operator: 'in',
                        value: [1, 2],
                    },
                },
            });
        });

        it('should skip invalid operators', () => {
            const { filters } = QueryStringParser.parse(
                'where[creator_id=eq[1],status=invalid[value]]',
            );

            expect(filters).toEqual({
                where: {
                    creator_id: {
                        operator: 'eq',
                        value: 1,
                    },
                },
            });
        });
    });
});
