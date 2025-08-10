import {
    VENUE_REPO_TOKEN,
    VenueRepository,
} from 'src/domain/repositories/venue.repository';
import { ListVenues } from './list-venues.usecase';
import { Test } from '@nestjs/testing';
import { ConfigModule } from 'src/config/config.module';
import { VenueEntity } from 'src/domain/entities/venue.entity';

describe('ListVenues use case', () => {
    let listVenues: ListVenues;
    let mockVenueRepository: jest.Mocked<Pick<VenueRepository, 'findAll'>>;

    beforeEach(async () => {
        mockVenueRepository = {
            findAll: jest.fn(),
        };

        const module = await Test.createTestingModule({
            providers: [
                ListVenues,
                {
                    provide: VENUE_REPO_TOKEN,
                    useValue: mockVenueRepository,
                },
            ],
            imports: [ConfigModule],
        }).compile();

        listVenues = module.get<ListVenues>(ListVenues);
    });

    it('should return all venues', async () => {
        const venues: VenueEntity[] = [
            {
                id: 1,
                name: 'Venue 1',
                address: 'Address 1',
                city: 'City 1',
                lat: 1,
                lng: 1,
                description: 'Description 1',
                organizer_id: 1,
                phone: '123456789',
                website: 'https://www.venue1.com',
                image_url: 'https://www.venue1.com/image.jpg',
                created_at: new Date(),
            },
            {
                id: 2,
                name: 'Venue 2',
                address: 'Address 2',
                city: 'City 2',
                lat: 2,
                lng: 2,
                description: 'Description 2',
                organizer_id: 2,
                phone: '987654321',
                website: 'https://www.venue2.com',
                image_url: 'https://www.venue2.com/image.jpg',
                created_at: new Date(),
            },
        ];
        mockVenueRepository.findAll.mockResolvedValue(venues);

        const result = await listVenues.execute();

        expect(result).toEqual(venues);
    });
});
