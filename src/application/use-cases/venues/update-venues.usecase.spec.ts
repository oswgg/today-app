import {
    VENUE_REPO_TOKEN,
    VenueRepository,
} from 'src/domain/repositories/venue.repository';
import { UpdateVenue } from './update-venue.usecase';
import {
    FILE_SERVICE_TOKEN,
    FileService,
} from 'src/domain/services/files.service';
import { I18nService } from 'nestjs-i18n';
import { I18nTranslations } from 'src/i18n/generated/i18n.generated';
import { Test } from '@nestjs/testing';

describe('UpdateVenue use case', () => {
    let updateVenue: UpdateVenue;
    let mockVenueRepository: jest.Mocked<
        Pick<VenueRepository, 'findById' | 'updateById' | 'findOne'>
    >;
    let mockFileService: jest.Mocked<Pick<FileService, 'move' | 'remove'>>;
    let mockTranslator: jest.Mocked<Pick<I18nService<I18nTranslations>, 't'>>;

    beforeEach(async () => {
        mockVenueRepository = {
            findOne: jest.fn(),
            findById: jest.fn(),
            updateById: jest.fn(),
        };
        mockFileService = {
            move: jest.fn(),
            remove: jest.fn(),
        };
        mockTranslator = {
            t: jest.fn(),
        };

        const module = await Test.createTestingModule({
            providers: [
                UpdateVenue,
                { provide: VENUE_REPO_TOKEN, useValue: mockVenueRepository },
                { provide: FILE_SERVICE_TOKEN, useValue: mockFileService },
                { provide: I18nService, useValue: mockTranslator },
            ],
        }).compile();

        updateVenue = module.get<UpdateVenue>(UpdateVenue);
    });

    it('should update a venue', async () => {
        const id = 1;
        const initialValues = {
            id,
            name: 'Old Name',
            address: 'Old Address',
            city: 'Old City',
            lat: 0,
            lng: 0,
            description: 'Old Description',
            phone: 'Old Phone',
            organizer_id: 1,
            website: 'old-website.com',
            image_url: 'old-image.jpg',
            created_at: new Date(),
        };
        const body = { name: 'New Name', image_url: 'new-image.jpg' };
        const expectedUpdatedVenue = { ...initialValues, ...body };

        mockVenueRepository.findOne.mockResolvedValue(null);
        mockVenueRepository.findById.mockResolvedValue({
            id,
            name: 'Old Name',
            address: 'Old Address',
            city: 'Old City',
            lat: 0,
            lng: 0,
            description: 'Old Description',
            phone: 'Old Phone',
            organizer_id: 1,
            website: 'old-website.com',
            image_url: 'old-image.jpg',
            created_at: new Date(),
        });
        mockVenueRepository.updateById.mockResolvedValue(expectedUpdatedVenue);

        const updatedVenue = await updateVenue.execute(id, body);

        expect(updatedVenue).toEqual(expectedUpdatedVenue);
    });
});
