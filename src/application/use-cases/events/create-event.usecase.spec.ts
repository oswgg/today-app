import {
    EVENTS_REPOSITORY_TOKEN,
    EventsRepository,
} from 'src/domain/repositories/events.repository';
import {
    LOCATION_REPO_TOKEN,
    LocationRepository,
} from 'src/domain/repositories/location.repository';
import { CreateEvent } from './create-event.usecase';
import { Test, TestingModule } from '@nestjs/testing';
import { CreateEventDto } from 'src/application/dtos/events/create-event.dto';
import { EventEntity } from 'src/domain/entities/event.entity';
import { ConfigModule } from 'src/config/config.module';

describe('CreateEvent use case', () => {
    let usecase: CreateEvent;
    let mockEventRepository: jest.Mocked<Pick<EventsRepository, 'create'>>;
    let mockLocationRepository: jest.Mocked<
        Pick<LocationRepository, 'findById'>
    >;

    beforeEach(async () => {
        mockEventRepository = {
            create: jest.fn(),
        };
        mockLocationRepository = {
            findById: jest.fn(),
        };

        const module: TestingModule = await Test.createTestingModule({
            providers: [
                CreateEvent,
                {
                    provide: EVENTS_REPOSITORY_TOKEN,
                    useValue: mockEventRepository,
                },
                {
                    provide: LOCATION_REPO_TOKEN,
                    useValue: mockLocationRepository,
                },
            ],
            imports: [ConfigModule],
        }).compile();

        usecase = module.get(CreateEvent);
    });

    it('should create an event', async () => {
        const data: CreateEventDto = {
            title: 'Test Event',
            description: 'This is a test event',
            creator_id: 1,
            start_time: new Date(),
            end_time: new Date(),
            locationAddress: 'Test Location',
            location_id: 1,
        };

        const eventEntity: EventEntity = {
            id: 1,
            title: 'Test Event',
            description: 'This is a test event',
            start_time: new Date(),
            creator_id: 1,
            end_time: new Date(),
            lat: null,
            lng: null,
            location_id: null,
            categories: [],
            locationAddress: 'Test Location',
            created_at: new Date(),
            image_url: null,
        };

        mockLocationRepository.findById.mockResolvedValue({
            id: 1,
            name: 'Test Location',
            address: 'Test Address',
            city: 'Test City',
            lat: 0,
            lng: 0,
            description: null,
            phone: null,
            website: null,
            creator_id: 1,
            created_at: new Date(),
            image_url: null,
        });
        mockEventRepository.create.mockResolvedValue(eventEntity);

        const result = await usecase.execute(data);

        expect(result).toEqual(eventEntity);
    });
});
