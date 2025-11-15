import { Test, TestingModule } from '@nestjs/testing';
import { ExecutionContext, ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { UserRoleGuard } from './user-role.guard';
import { UserRole } from 'src/domain/types/user-role.enum';
import { ConfigModule } from 'src/config/config.module';
import { ExpressRequestWithUser } from 'src/infrastructure/http/types/express/express.request-with-user';
import { REQUIRED_ROLE_KEY } from '../decorators/required-user-role.decorator';

describe('UserRoleGuard', () => {
    let guard: UserRoleGuard;
    let reflector: Reflector;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [UserRoleGuard, Reflector],
            imports: [ConfigModule],
        }).compile();

        guard = module.get<UserRoleGuard>(UserRoleGuard);
        reflector = module.get<Reflector>(Reflector);
    });

    it('should be defined', () => {
        expect(guard).toBeDefined();
    });

    it('should allow access when user has ORGANIZER role and ORGANIZER is required', () => {
        const context = createMockExecutionContext({
            user: {
                id: 1,
                name: 'Test Organizer',
                email: 'organizer@example.com',
                role: UserRole.ORGANIZER,
            },
        });

        jest.spyOn(reflector, 'get').mockReturnValue([UserRole.ORGANIZER]);

        expect(guard.canActivate(context)).toBe(true);
    });

    it('should allow access when user has INSTITUTION role and INSTITUTION is required', () => {
        const context = createMockExecutionContext({
            user: {
                id: 1,
                name: 'Test Institution',
                email: 'institution@example.com',
                role: UserRole.INSTITUTION,
            },
        });

        jest.spyOn(reflector, 'get').mockReturnValue([UserRole.INSTITUTION]);

        expect(guard.canActivate(context)).toBe(true);
    });

    it('should allow access when user has ORGANIZER role and both ORGANIZER and INSTITUTION are accepted', () => {
        const context = createMockExecutionContext({
            user: {
                id: 1,
                name: 'Test Organizer',
                email: 'organizer@example.com',
                role: UserRole.ORGANIZER,
            },
        });

        jest.spyOn(reflector, 'get').mockReturnValue([
            UserRole.ORGANIZER,
            UserRole.INSTITUTION,
        ]);

        expect(guard.canActivate(context)).toBe(true);
    });

    it('should allow access when user has INSTITUTION role and both ORGANIZER and INSTITUTION are accepted', () => {
        const context = createMockExecutionContext({
            user: {
                id: 1,
                name: 'Test Institution',
                email: 'institution@example.com',
                role: UserRole.INSTITUTION,
            },
        });

        jest.spyOn(reflector, 'get').mockReturnValue([
            UserRole.ORGANIZER,
            UserRole.INSTITUTION,
        ]);

        expect(guard.canActivate(context)).toBe(true);
    });

    it('should deny access when user has USER role and ORGANIZER is required', () => {
        const context = createMockExecutionContext({
            user: {
                id: 1,
                name: 'Test User',
                email: 'user@example.com',
                role: UserRole.USER,
            },
        });

        jest.spyOn(reflector, 'get').mockReturnValue([UserRole.ORGANIZER]);

        expect(() => guard.canActivate(context)).toThrow(ForbiddenException);
    });

    it('should deny access when user has USER role and INSTITUTION is required', () => {
        const context = createMockExecutionContext({
            user: {
                id: 1,
                name: 'Test User',
                email: 'user@example.com',
                role: UserRole.USER,
            },
        });

        jest.spyOn(reflector, 'get').mockReturnValue([UserRole.INSTITUTION]);

        expect(() => guard.canActivate(context)).toThrow(ForbiddenException);
    });

    it('should deny access when user has USER role and both ORGANIZER and INSTITUTION are required', () => {
        const context = createMockExecutionContext({
            user: {
                id: 1,
                name: 'Test User',
                email: 'user@example.com',
                role: UserRole.USER,
            },
        });

        jest.spyOn(reflector, 'get').mockReturnValue([
            UserRole.ORGANIZER,
            UserRole.INSTITUTION,
        ]);

        expect(() => guard.canActivate(context)).toThrow(ForbiddenException);
    });

    it('should deny access when user has ORGANIZER role but only INSTITUTION is required', () => {
        const context = createMockExecutionContext({
            user: {
                id: 1,
                name: 'Test Organizer',
                email: 'organizer@example.com',
                role: UserRole.ORGANIZER,
            },
        });

        jest.spyOn(reflector, 'get').mockReturnValue([UserRole.INSTITUTION]);

        expect(() => guard.canActivate(context)).toThrow(ForbiddenException);
    });

    it('should deny access when user has INSTITUTION role but only ORGANIZER is required', () => {
        const context = createMockExecutionContext({
            user: {
                id: 1,
                name: 'Test Institution',
                email: 'institution@example.com',
                role: UserRole.INSTITUTION,
            },
        });

        jest.spyOn(reflector, 'get').mockReturnValue([UserRole.ORGANIZER]);

        expect(() => guard.canActivate(context)).toThrow(ForbiddenException);
    });

    it('should allow access when no required roles are specified', () => {
        const context = createMockExecutionContext({
            user: {
                id: 1,
                name: 'Test User',
                email: 'user@example.com',
                role: UserRole.USER,
            },
        });

        jest.spyOn(reflector, 'get').mockReturnValue(undefined);

        expect(guard.canActivate(context)).toBe(true);
    });

    it('should throw correct error message when access is denied', () => {
        const context = createMockExecutionContext({
            user: {
                id: 1,
                name: 'Test User',
                email: 'user@example.com',
                role: UserRole.USER,
            },
        });

        jest.spyOn(reflector, 'get').mockReturnValue([UserRole.ORGANIZER]);

        try {
            guard.canActivate(context);
            fail('Expected ForbiddenException to be thrown');
        } catch (error) {
            expect(error).toBeInstanceOf(ForbiddenException);
            expect(error.message).toContain(
                'Rol de usuario no permitido para esta acción',
            );
        }
    });
});

function createMockExecutionContext(request: Partial<ExpressRequestWithUser>) {
    const mockContext = {
        switchToHttp: () => ({
            getRequest: () => request,
        }),
        getHandler: () => ({}),
    } as unknown as ExecutionContext;

    return mockContext;
}
