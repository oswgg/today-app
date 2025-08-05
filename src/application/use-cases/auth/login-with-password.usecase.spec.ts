import { Test, TestingModule } from '@nestjs/testing';
import { LoginWithPassword } from './login-with-password.usecase';
import {
    AUTH_SERVICE_TOKEN,
    AuthService,
    LoginResult,
} from 'src/domain/services/auth.service';
import {
    USER_REPO_TOKEN,
    UserRepository,
} from 'src/domain/repositories/user.repository';
import { UserRole } from 'src/domain/types/user-role.enum';

describe('LoginWithPasswordUsecase', () => {
    let usecase: LoginWithPassword;
    let mockAuthService: jest.Mocked<Pick<AuthService, 'loginWithPassword'>>;
    let mockUserRepo: jest.Mocked<Pick<UserRepository, 'findByEmail'>>;

    beforeEach(async () => {
        mockAuthService = {
            loginWithPassword: jest.fn(),
        };

        mockUserRepo = {
            findByEmail: jest.fn(),
        };

        const module: TestingModule = await Test.createTestingModule({
            providers: [
                LoginWithPassword,
                { provide: AUTH_SERVICE_TOKEN, useValue: mockAuthService },
                { provide: USER_REPO_TOKEN, useValue: mockUserRepo },
            ],
        }).compile();

        usecase = module.get<LoginWithPassword>(LoginWithPassword);
    });

    it('should return login response', async () => {
        const email = 'test@email.com';
        const password = 'testPassword';

        const loginResult: LoginResult = {
            user: { email, role: UserRole.USER },
            token: 'test-token',
        };

        const testUser = {
            id: 1,
            email: email,
            name: 'Test User',
            role: UserRole.USER,
            uid: 'test-uid',
            createdAt: new Date(),
        };

        mockUserRepo.findByEmail.mockResolvedValue(testUser);
        mockAuthService.loginWithPassword.mockResolvedValue(loginResult);

        await expect(usecase.execute({ email, password })).resolves.toEqual(
            loginResult,
        );
    });

    it('should throw an error if user not found', async () => {
        const email = 'test@email.com';
        const password = 'testPassword';

        mockUserRepo.findByEmail.mockResolvedValue(null);

        await expect(usecase.execute({ email, password })).rejects.toThrow(
            'Invalid email or password',
        );
    });

    it('should throw an error if failed to login with password', async () => {
        const email = 'test@email.com';
        const password = 'testPassword';
        mockUserRepo.findByEmail.mockResolvedValue({
            id: 1,
            email: email,
            name: 'Test User',
            role: UserRole.USER,
            uid: 'test-uid',
            createdAt: new Date(),
        });

        mockAuthService.loginWithPassword.mockRejectedValue(
            new Error('Failed to login'),
        );

        await expect(usecase.execute({ email, password })).rejects.toThrow(
            'Failed to login',
        );
    });
});
