import { Test, TestingModule } from '@nestjs/testing';
import { ExecutionContext } from '@nestjs/common';
import { OrganizerGuard } from './organizer-role.guard';
import { UserRole } from 'src/domain/types/user-role.enum';
import { ExpressRequestWithUser } from 'src/infrastructure/types/http/express.request-with-user';

describe('OrganizerGuard', () => {
    let guard: OrganizerGuard;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [OrganizerGuard],
        }).compile();

        guard = module.get<OrganizerGuard>(OrganizerGuard);
    });

    it('should be defined', () => {
        expect(guard).toBeDefined();
    });

    it('should allow access when user has ORGANIZER role', () => {
        const context = createMockExecutionContext({
            user: {
                id: 1,
                name: 'Test Organizer',
                email: 'organizer@example.com',
                role: UserRole.ORGANIZER,
            },
        });

        expect(guard.canActivate(context)).toBe(true);
    });

    it('should deny access when user does not have ORGANIZER role', () => {
        const context = createMockExecutionContext({
            user: {
                id: 1,
                name: 'Test User',
                email: 'user@example.com',
                role: UserRole.USER,
            },
        });

        expect(guard.canActivate(context)).toBe(false);
    });
});

function createMockExecutionContext(request: Partial<ExpressRequestWithUser>) {
    const mockContext = {
        switchToHttp: () => ({
            getRequest: () => request,
        }),
    } as unknown as ExecutionContext;

    return mockContext;
}
