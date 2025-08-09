import {
    AUTH_SERVICE_TOKEN,
    AuthService,
    LoginResult,
    UserFromOAuth,
} from 'src/domain/services/auth.service';
import {
    USER_REPO_TOKEN,
    UserRepository,
} from 'src/domain/repositories/user.repository';
import { Test, TestingModule } from '@nestjs/testing';
import { UserRole } from 'src/domain/types/user-role.enum';
import { LoginWithOAuth } from './login-with-oauth.usecase';
import { ConfigModule } from 'src/config/config.module';

describe('LoginWithOAuth use case', () => {
    let usecase: LoginWithOAuth;
    let mockAuthService: jest.Mocked<
        Pick<AuthService, 'getUserFromOAuthToken' | 'loginWithOAuth'>
    >;
    let mockUserRepo: jest.Mocked<Pick<UserRepository, 'findByEmail'>>;

    beforeEach(async () => {
        mockAuthService = {
            getUserFromOAuthToken: jest.fn(),
            loginWithOAuth: jest.fn(),
        };
        mockUserRepo = {
            findByEmail: jest.fn(),
        };

        const module: TestingModule = await Test.createTestingModule({
            providers: [
                LoginWithOAuth,
                {
                    provide: AUTH_SERVICE_TOKEN,
                    useValue: mockAuthService,
                },
                {
                    provide: USER_REPO_TOKEN,
                    useValue: mockUserRepo,
                },
            ],
            imports: [ConfigModule],
        }).compile();

        usecase = module.get(LoginWithOAuth);
    });

    it('should return login response', async () => {
        const token = 'test-token';
        const email = 'test@email.com';

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

        const userFromOAuth: UserFromOAuth = {
            email: email,
            name: 'Test User',
            uid: 'test-uid',
        };

        mockUserRepo.findByEmail.mockResolvedValue(testUser);
        mockAuthService.getUserFromOAuthToken.mockResolvedValue(userFromOAuth);
        mockAuthService.loginWithOAuth.mockResolvedValue(loginResult);

        await expect(usecase.execute(token)).resolves.toEqual(loginResult);
    });
});
