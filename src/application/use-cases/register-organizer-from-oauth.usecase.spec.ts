import {
    USER_REPO_TOKEN,
    UserRepository,
} from 'src/domain/repositories/user.repository';
import { RegisterOrganizerFromOAuth } from './register-organizer-from-oauth.usecase';
import {
    AUTH_SERVICE_TOKEN,
    AuthService,
} from 'src/domain/services/auth.service';
import { Test, TestingModule } from '@nestjs/testing';
import { OrganizerEntity } from 'src/domain/entities/organizer.entity';
import { UserRole } from 'src/domain/types/user-role.enum';

describe('RegisterOrganizerFromOAuth use case', () => {
    let registerOrganizer: RegisterOrganizerFromOAuth;
    let mockAuthService: jest.Mocked<AuthService>;
    let mockUserRepo: jest.Mocked<UserRepository>;

    beforeEach(async () => {
        mockAuthService = {
            getUserFromOAuthToken: jest.fn(),
            getGoogleOAuthURL: jest.fn(),
        };
        mockUserRepo = {
            create: jest.fn(),
            findByEmail: jest.fn(),
            findById: jest.fn(),
        };

        const module: TestingModule = await Test.createTestingModule({
            providers: [
                RegisterOrganizerFromOAuth,
                { provide: USER_REPO_TOKEN, useValue: mockUserRepo },
                { provide: AUTH_SERVICE_TOKEN, useValue: mockAuthService },
            ],
        }).compile();

        registerOrganizer = module.get(RegisterOrganizerFromOAuth);
    });

    it('should register an organizer', async () => {
        const organizer: OrganizerEntity = {
            id: 1,
            name: 'Test Organizer',
            email: 'test@example.com',
            role: UserRole.ORGANIZER,
            createdAt: new Date(),
            uid: 'test-uid',
        };

        mockUserRepo.create.mockResolvedValue(organizer);
        mockAuthService.getUserFromOAuthToken.mockResolvedValue({
            email: organizer.email,
            name: organizer.name,
            uid: organizer.uid,
        });

        expect(await registerOrganizer.execute('test-token')).toEqual(
            organizer,
        );
    });

    it('shoud throw an error if user is already registered', async () => {
        const existingOrganizer: OrganizerEntity = {
            id: 1,
            name: 'Test Organizer',
            email: 'test@example.com',
            role: UserRole.ORGANIZER,
            createdAt: new Date(),
            uid: 'test-uid',
        };

        mockAuthService.getUserFromOAuthToken.mockResolvedValue({
            email: existingOrganizer.email,
            name: existingOrganizer.name,
            uid: existingOrganizer.uid,
        });
        mockUserRepo.findByEmail.mockResolvedValue(existingOrganizer);

        await expect(registerOrganizer.execute('test-token')).rejects.toThrow(
            'User already exists',
        );
    });

    it('should throw an error if failed to get user from OAuth token', async () => {
        mockAuthService.getUserFromOAuthToken.mockRejectedValue(
            new Error('Failed to get user from OAuth token'),
        );

        await expect(registerOrganizer.execute('test-token')).rejects.toThrow(
            'Failed to get user from OAuth token',
        );
    });
});
