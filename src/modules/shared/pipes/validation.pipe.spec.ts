import { Validator } from 'src/infrastructure/http/validator/validator';
import { ValidationPipe } from './validation.pipe';

describe('ValidationPipe', () => {
    it('should call validate and return the validated value', () => {
        // Arrange
        const validatedValue = { foo: 'bar' };
        const mockValidator: jest.Mocked<Validator<{ foo: string }>> = {
            validate: jest.fn(),
        };

        mockValidator.validate.mockReturnValue(validatedValue);

        const pipe = new ValidationPipe(mockValidator);

        // Act
        const result = pipe.transform({ foo: 'bar' });

        expect(mockValidator.validate).toHaveBeenCalledWith({ foo: 'bar' });
        expect(result).toBe(validatedValue);
    });

    it('should throw if the validator throws', () => {
        // Arrange
        const mockValidator: jest.Mocked<Validator<{ foo: string }>> = {
            validate: jest.fn(function (this: void, schema: unknown) {
                throw new Error('Validation failed', { cause: schema });
            }),
        };

        const pipe = new ValidationPipe(mockValidator);

        // Act
        expect(() => pipe.transform({ foo: 'bar' })).toThrow(
            'Validation failed',
        );
    });
});
