import {
    VENUE_REPO_TOKEN,
    VenueRepository,
} from 'src/domain/repositories/venue.repository';
import { DeleteVenue } from './delete-venue.usecase';
import { Test } from '@nestjs/testing';
import { ConfigModule } from 'src/config/config.module';

describe('DeleteVenue use case', () => {
    let deleteVenue: DeleteVenue;
    let mockVenueRepository: jest.Mocked<Pick<VenueRepository, 'deleteById'>>;

    beforeEach(async () => {
        mockVenueRepository = {
            deleteById: jest.fn(),
        };

        const moduleRef = await Test.createTestingModule({
            providers: [
                DeleteVenue,
                {
                    provide: VENUE_REPO_TOKEN,
                    useValue: mockVenueRepository,
                },
            ],
            imports: [ConfigModule],
        }).compile();

        deleteVenue = moduleRef.get<DeleteVenue>(DeleteVenue);
    });

    it('should delete a venue', async () => {
        const id = 1;

        await deleteVenue.execute(id);

        expect(mockVenueRepository.deleteById).toHaveBeenCalledWith(id);
    });
});
