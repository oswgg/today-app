import { ZodType } from 'zod';
import { Validator } from '../validator';
import { BadRequestException } from '@nestjs/common';

export class ZodValidator<T> implements Validator<T> {
    constructor(private schema: ZodType<T>) {}

    validate(input: unknown): T {
        const validated = this.schema.safeParse(input);
        if (!validated.success) {
            // Extract all errors and format them nicely
            const errors = validated.error.issues.map((err) => ({
                path: err.path.join('.'),
                message: err.message,
            }));

            throw new BadRequestException({
                message:
                    'Invalid input data. Please check the provided schema.',
                errors,
            });
        }

        return validated.data;
    }
}
