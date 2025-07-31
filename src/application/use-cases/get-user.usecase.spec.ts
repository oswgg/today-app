import { Test, TestingModule } from '@nestjs/testing';
import { GetUser } from './get-user.usecase';
import {
    USER_REPO_TOKEN,
    UserRepository,
} from 'src/domain/repositories/user.repository';
import { UserEntity } from 'src/domain/entities/user.entity';
import { UserRole } from 'src/domain/types/user-role.enum';

describe('GetUser use case', () => {
    let getUser: GetUser;
    let mockUserRepo: jest.Mocked<Pick<UserRepository, 'findById'>>;

    beforeEach(async () => {
        mockUserRepo = {
            findById: jest.fn(),
        };

        const module: TestingModule = await Test.createTestingModule({
            providers: [
                GetUser,
                {
                    provide: USER_REPO_TOKEN,
                    useValue: mockUserRepo,
                },
            ],
        }).compile();

        getUser = module.get(GetUser);
    });

    it('should return user', async () => {
        const user: UserEntity = {
            id: 1,
            email: 'test@example.com',
            name: 'Test User',
            role: UserRole.USER,
            createdAt: new Date(),
            uid: 'test-uid',
        };
        mockUserRepo.findById.mockResolvedValue(user);

        expect(await getUser.execute(1)).toEqual(user);
    });
});
