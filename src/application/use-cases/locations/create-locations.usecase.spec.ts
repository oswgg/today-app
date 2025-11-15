import {
    LOCATION_REPO_TOKEN,
    LocationRepository,
} from 'src/domain/repositories/location.repository';
import { CreateLocation } from './create-location.usecase';
import { Test, TestingModule } from '@nestjs/testing';
import { InputCreateLocationDto } from 'src/application/dtos/locations/create-location.dto';
import { LocationEntity } from 'src/domain/entities/location.entity';
import { ForbiddenException } from '@nestjs/common';
import { ConfigModule } from 'src/config/config.module';
import {
    FILE_SERVICE_TOKEN,
    FileService,
} from 'src/domain/services/files.service';

describe('CreateLocation use case', () => {
    let createVenueUseCase: jest.Mocked<CreateLocation>;
    let mockLocationRepository: jest.Mocked<
        Pick<LocationRepository, 'create' | 'findByLocation' | 'findOne'>
    >;
    let mockFileService: jest.Mocked<FileService>;

    beforeEach(async () => {
        mockLocationRepository = {
            create: jest.fn(),
            findByLocation: jest.fn(),
            findOne: jest.fn(),
        };

        mockFileService = {
            move: jest.fn(),
            remove: jest.fn(),
            generateUniqueName: jest.fn(),
        };

        mockLocationRepository.findByLocation.mockResolvedValue([]);

        const module: TestingModule = await Test.createTestingModule({
            providers: [
                CreateLocation,
                {
                    provide: LOCATION_REPO_TOKEN,
                    useValue: mockLocationRepository,
                },
                {
                    provide: FILE_SERVICE_TOKEN,
                    useValue: mockFileService,
                },
            ],
            imports: [ConfigModule],
        }).compile();

        createVenueUseCase = module.get(CreateLocation);
    });

    it('should create a venue', async () => {
        const input: InputCreateLocationDto & {
            creator_id: number | bigint;
        } = {
            name: 'Test Venue',
            address: 'Test Address',
            city: 'Test City',
            lat: 10.0,
            lng: 20.0,
            description: 'Test Description',
            phone: '1234567890',
            website: 'example.com',
            creator_id: 1,
        };

        const venue: LocationEntity = {
            id: 1,
            name: 'Test Venue',
            address: 'Test Address',
            city: 'Test City',
            lat: 10.0,
            lng: 20.0,
            description: 'Test Description',
            phone: '1234567890',
            website: 'example.com',
            creator_id: 1,
            created_at: new Date(),
            image_url: null,
        };

        mockLocationRepository.create.mockResolvedValue(venue);

        const output = await createVenueUseCase.execute(input);

        expect(mockLocationRepository.create).toHaveBeenCalledWith(input);
        expect(output).toEqual(venue);
    });

    it('should throw a ForbiddenException if a venue already exists at the given location', async () => {
        const input: InputCreateLocationDto & {
            creator_id: number | bigint;
        } = {
            name: 'Test Venue',
            address: 'Test Address',
            city: 'Test City',
            lat: 10.0,
            lng: 20.0,
            description: 'Test Description',
            phone: '1234567890',
            website: 'example.com',
            creator_id: 1,
        };

        const existingVenue: LocationEntity = {
            id: 1,
            name: 'Test Venue',
            address: 'Test Address',
            city: 'Test City',
            lat: 10.0,
            lng: 20.0,
            description: 'Test Description',
            phone: '1234567890',
            website: 'example.com',
            creator_id: 1,
            created_at: new Date(),
            image_url: null,
        };

        mockLocationRepository.findByLocation.mockResolvedValue([
            existingVenue,
        ]);

        await expect(() => createVenueUseCase.execute(input)).rejects.toThrow(
            ForbiddenException,
        );
    });

    it('should throw a ForbiddenException if a venue with the same name already exists for the given organizer', async () => {
        const input: InputCreateLocationDto & {
            creator_id: number | bigint;
        } = {
            name: 'Test Venue',
            address: 'Test Address',
            city: 'Test City',
            lat: 10.0,
            lng: 20.0,
            description: 'Test Description',
            phone: '1234567890',
            website: 'example.com',
            creator_id: 1,
        };

        const existingVenue: LocationEntity = {
            id: 1,
            name: 'Test Venue',
            address: 'Test Address',
            city: 'Test City',
            lat: 10.0,
            lng: 20.0,
            description: 'Test Description',
            phone: '1234567890',
            website: 'example.com',
            creator_id: 1,
            created_at: new Date(),
            image_url: null,
        };

        mockLocationRepository.findOne.mockResolvedValue(existingVenue);
        await expect(() => createVenueUseCase.execute(input)).rejects.toThrow(
            ForbiddenException,
        );
    });
});
