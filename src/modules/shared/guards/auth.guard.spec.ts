import { JWT_SERVICE_TOKEN, JwtService } from 'src/domain/services/jwt.service';
import { AuthGuard } from './auth.guard';
import { Reflector } from '@nestjs/core';
import { Test, TestingModule } from '@nestjs/testing';
import { ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { JWTPayload } from 'src/domain/entities/auth/jwt-payload.entity';
import { UserRole } from 'src/domain/types/user-role.enum';
import { Request } from 'express';
import { ConfigModule } from 'src/config/config.module';

describe('AuthGuard', () => {
    let guard: AuthGuard;
    let jwtService: jest.Mocked<JwtService>;
    let reflector: jest.Mocked<Pick<Reflector, 'getAllAndOverride'>>;

    beforeEach(async () => {
        jwtService = {
            sign: jest.fn(),
            verify: jest.fn(),
        };

        reflector = {
            getAllAndOverride: jest.fn(),
        };

        const module: TestingModule = await Test.createTestingModule({
            providers: [
                AuthGuard,
                {
                    provide: JWT_SERVICE_TOKEN,
                    useValue: jwtService,
                },
                {
                    provide: Reflector,
                    useValue: reflector,
                },
            ],
            imports: [ConfigModule],
        }).compile();

        guard = module.get<AuthGuard>(AuthGuard);
    });

    it('should be defined', () => {
        expect(guard).toBeDefined();
    });

    it('should allow acces to public routes', () => {
        const context: ExecutionContext = createMockExecutionContext();
        reflector.getAllAndOverride.mockReturnValue(true); // isPublic

        expect(guard.canActivate(context)).toBe(true);
    });

    it('should throw UnauthorizedException when token is not provided', () => {
        const context = createMockExecutionContext({
            headers: { authorization: undefined },
        });

        reflector.getAllAndOverride.mockReturnValue(false); // isPublic

        expect(() => guard.canActivate(context)).toThrow(UnauthorizedException);
    });

    it('should throw UnauthorizedException when token is invalid', () => {
        const context = createMockExecutionContext({
            headers: { authorization: 'Bearer invalid-token' },
        });

        reflector.getAllAndOverride.mockReturnValue(false); // isPublic

        jwtService.verify.mockReturnValue(null);

        expect(() => guard.canActivate(context)).toThrow(UnauthorizedException);
    });

    it('should allow access when token is valid', () => {
        const mockRequest = {
            headers: { authorization: 'Bearer valid-token' },
            user: undefined,
        };

        const context = createMockExecutionContext(mockRequest);
        reflector.getAllAndOverride.mockReturnValue(false); // isPublic

        const payload: JWTPayload = {
            user: {
                id: 1,
                name: 'test',
                email: 'test@example.com',
                role: UserRole.ORGANIZER,
            },
            iat: 1234567890,
            exp: 1234567890,
        };

        jwtService.verify.mockReturnValue(payload);

        expect(guard.canActivate(context)).toBe(true);
        expect(mockRequest.user).toEqual(payload.user);
    });

    it('should throw UnauthorizedException when token verification fails', () => {
        const context = createMockExecutionContext({
            headers: { authorization: 'Bearer valid-token' },
        });
        reflector.getAllAndOverride.mockReturnValue(false); // Route is not public
        jwtService.verify.mockImplementation(() => {
            throw new Error('Token verification failed');
        });

        expect(() => guard.canActivate(context)).toThrow(UnauthorizedException);
        expect(() => guard.canActivate(context)).toThrow('Token inválido');
    });
});

function createMockExecutionContext(
    request: Partial<Request> = {},
): ExecutionContext {
    const mockContext = {
        switchToHttp: () => ({
            getRequest: () => request,
        }),
        getHandler: () => ({}),
        getClass: () => ({}),
    } as unknown as ExecutionContext;

    return mockContext;
}
