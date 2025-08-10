import { SetMetadata } from '@nestjs/common';
import { IS_PUBLIC_KEY, Public } from './public.decorator';

jest.mock('@nestjs/common', () => ({
    SetMetadata: jest.fn(),
}));

describe('Public Decorator', () => {
    it('should call SetMetadata with the correct parameters', () => {
        // Call the Public decorator
        Public();

        // Verify that SetMetadata was called with the correct parameters
        expect(SetMetadata).toHaveBeenCalledWith(IS_PUBLIC_KEY, true);
    });
});
