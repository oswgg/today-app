import {
    LOCATION_REPO_TOKEN,
    LocationRepository,
} from 'src/domain/repositories/location.repository';
import { UpdateLocation } from './update-location.usecase';
import {
    FILE_SERVICE_TOKEN,
    FileService,
} from 'src/domain/services/files.service';
import { I18nService } from 'nestjs-i18n';
import { I18nTranslations } from 'src/i18n/generated/i18n.generated';
import { Test } from '@nestjs/testing';

describe('UpdateLocation use case', () => {
    let updateVenue: UpdateLocation;
    let mockLocationRepository: jest.Mocked<
        Pick<LocationRepository, 'findById' | 'updateById' | 'findOne'>
    >;
    let mockFileService: jest.Mocked<Pick<FileService, 'move' | 'remove'>>;
    let mockTranslator: jest.Mocked<Pick<I18nService<I18nTranslations>, 't'>>;

    beforeEach(async () => {
        mockLocationRepository = {
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
                UpdateLocation,
                {
                    provide: LOCATION_REPO_TOKEN,
                    useValue: mockLocationRepository,
                },
                { provide: FILE_SERVICE_TOKEN, useValue: mockFileService },
                { provide: I18nService, useValue: mockTranslator },
            ],
        }).compile();

        updateVenue = module.get<UpdateLocation>(UpdateLocation);
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
            creator_id: 1,
            website: 'old-website.com',
            created_at: new Date(),
            image_url: null,
        };
        const body = { name: 'New Name' };
        const expectedUpdatedVenue = { ...initialValues, ...body };

        mockLocationRepository.findOne.mockResolvedValue(null);
        mockLocationRepository.findById.mockResolvedValue({
            id,
            name: 'Old Name',
            address: 'Old Address',
            city: 'Old City',
            lat: 0,
            lng: 0,
            description: 'Old Description',
            phone: 'Old Phone',
            creator_id: 1,
            website: 'old-website.com',
            created_at: new Date(),
            image_url: null,
        });
        mockLocationRepository.updateById.mockResolvedValue(
            expectedUpdatedVenue,
        );

        const updatedVenue = await updateVenue.execute(id, body);

        expect(updatedVenue).toEqual(expectedUpdatedVenue);
    });
});
