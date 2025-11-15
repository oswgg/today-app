import {
    LOCATION_REPO_TOKEN,
    LocationRepository,
} from 'src/domain/repositories/location.repository';
import { DeleteLocation } from './delete-location.usecase';
import { Test } from '@nestjs/testing';
import { ConfigModule } from 'src/config/config.module';

describe('DeleteLocation use case', () => {
    let deleteVenue: DeleteLocation;
    let mockLocationRepository: jest.Mocked<
        Pick<LocationRepository, 'deleteById'>
    >;

    beforeEach(async () => {
        mockLocationRepository = {
            deleteById: jest.fn(),
        };

        const moduleRef = await Test.createTestingModule({
            providers: [
                DeleteLocation,
                {
                    provide: LOCATION_REPO_TOKEN,
                    useValue: mockLocationRepository,
                },
            ],
            imports: [ConfigModule],
        }).compile();

        deleteVenue = moduleRef.get<DeleteLocation>(DeleteLocation);
    });

    it('should delete a venue', async () => {
        const id = 1;

        await deleteVenue.execute(id);

        expect(mockLocationRepository.deleteById).toHaveBeenCalledWith(id);
    });
});
