import {
    VENUE_REPO_TOKEN,
    VenueRepository,
} from 'src/domain/repositories/venue.repository';
import { CreateVenue } from './create-venue.usecase';
import { Test, TestingModule } from '@nestjs/testing';
import { InputCreateVenueDto } from 'src/application/dtos/venues/create-venue.dto';
import { VenueEntity } from 'src/domain/entities/venue.entity';
import { ForbiddenException } from '@nestjs/common';
import { ConfigModule } from 'src/config/config.module';

describe('CreateVenue use case', () => {
    let createVenueUseCase: jest.Mocked<CreateVenue>;
    let mockVenueRepository: jest.Mocked<
        Pick<VenueRepository, 'create' | 'findByLocation' | 'findOne'>
    >;

    beforeEach(async () => {
        mockVenueRepository = {
            create: jest.fn(),
            findByLocation: jest.fn(),
            findOne: jest.fn(),
        };

        mockVenueRepository.findByLocation.mockResolvedValue([]);

        const module: TestingModule = await Test.createTestingModule({
            providers: [
                CreateVenue,
                { provide: VENUE_REPO_TOKEN, useValue: mockVenueRepository },
            ],
            imports: [ConfigModule],
        }).compile();

        createVenueUseCase = module.get(CreateVenue);
    });

    it('should create a venue', async () => {
        const input: InputCreateVenueDto & { organizer_id: number | bigint } = {
            name: 'Test Venue',
            address: 'Test Address',
            city: 'Test City',
            lat: 10.0,
            lng: 20.0,
            description: 'Test Description',
            phone: '1234567890',
            website: 'example.com',
            image_url: 'https://example.com/image.jpg',
            organizer_id: 1,
        };

        const venue: VenueEntity = {
            id: 1,
            name: 'Test Venue',
            address: 'Test Address',
            city: 'Test City',
            lat: 10.0,
            lng: 20.0,
            description: 'Test Description',
            phone: '1234567890',
            website: 'example.com',
            image_url: 'https://example.com/image.jpg',
            organizer_id: 1,
            created_at: new Date(),
        };

        mockVenueRepository.create.mockResolvedValue(venue);

        const output = await createVenueUseCase.execute(input);

        expect(mockVenueRepository.create).toHaveBeenCalledWith(input);
        expect(output).toEqual(venue);
    });

    it('should throw a ForbiddenException if a venue already exists at the given location', async () => {
        const input: InputCreateVenueDto & { organizer_id: number | bigint } = {
            name: 'Test Venue',
            address: 'Test Address',
            city: 'Test City',
            lat: 10.0,
            lng: 20.0,
            description: 'Test Description',
            phone: '1234567890',
            website: 'example.com',
            image_url: 'https://example.com/image.jpg',
            organizer_id: 1,
        };

        const existingVenue: VenueEntity = {
            id: 1,
            name: 'Test Venue',
            address: 'Test Address',
            city: 'Test City',
            lat: 10.0,
            lng: 20.0,
            description: 'Test Description',
            phone: '1234567890',
            website: 'example.com',
            image_url: 'https://example.com/image.jpg',
            organizer_id: 1,
            created_at: new Date(),
        };

        mockVenueRepository.findByLocation.mockResolvedValue([existingVenue]);

        await expect(() => createVenueUseCase.execute(input)).rejects.toThrow(
            ForbiddenException,
        );
    });

    it('should throw a ForbiddenException if a venue with the same name already exists for the given organizer', async () => {
        const input: InputCreateVenueDto & { organizer_id: number | bigint } = {
            name: 'Test Venue',
            address: 'Test Address',
            city: 'Test City',
            lat: 10.0,
            lng: 20.0,
            description: 'Test Description',
            phone: '1234567890',
            website: 'example.com',
            image_url: 'https://example.com/image.jpg',
            organizer_id: 1,
        };

        const existingVenue: VenueEntity = {
            id: 1,
            name: 'Test Venue',
            address: 'Test Address',
            city: 'Test City',
            lat: 10.0,
            lng: 20.0,
            description: 'Test Description',
            phone: '1234567890',
            website: 'example.com',
            image_url: 'https://example.com/image.jpg',
            organizer_id: 1,
            created_at: new Date(),
        };

        mockVenueRepository.findOne.mockResolvedValue(existingVenue);
        await expect(() => createVenueUseCase.execute(input)).rejects.toThrow(
            ForbiddenException,
        );
    });
});
