import {
    LOCATION_REPO_TOKEN,
    LocationRepository,
} from 'src/domain/repositories/location.repository';
import { ListLocations } from './list-locations.usecase';
import { Test } from '@nestjs/testing';
import { ConfigModule } from 'src/config/config.module';
import { LocationEntity } from 'src/domain/entities/location.entity';

describe('ListLocations use case', () => {
    let listVenues: ListLocations;
    let mockLocationRepository: jest.Mocked<
        Pick<LocationRepository, 'findAll'>
    >;

    beforeEach(async () => {
        mockLocationRepository = {
            findAll: jest.fn(),
        };

        const module = await Test.createTestingModule({
            providers: [
                ListLocations,
                {
                    provide: LOCATION_REPO_TOKEN,
                    useValue: mockLocationRepository,
                },
            ],
            imports: [ConfigModule],
        }).compile();

        listVenues = module.get<ListLocations>(ListLocations);
    });

    it('should return all venues', async () => {
        const venues: LocationEntity[] = [
            {
                id: 1,
                name: 'Venue 1',
                address: 'Address 1',
                city: 'City 1',
                lat: 1,
                lng: 1,
                description: 'Description 1',
                creator_id: 1,
                phone: '123456789',
                website: 'https://www.venue1.com',
                created_at: new Date(),
                image_url: null,
            },
            {
                id: 2,
                name: 'Venue 2',
                address: 'Address 2',
                city: 'City 2',
                lat: 2,
                lng: 2,
                description: 'Description 2',
                creator_id: 2,
                phone: '987654321',
                website: 'https://www.venue2.com',
                created_at: new Date(),
                image_url: null,
            },
        ];
        mockLocationRepository.findAll.mockResolvedValue(venues);

        const result = await listVenues.execute();

        expect(result).toEqual(venues);
    });
});
