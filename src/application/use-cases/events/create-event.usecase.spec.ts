import {
    EVENTS_REPOSITORY_TOKEN,
    EventsRepository,
} from 'src/domain/repositories/events.repository';
import { CreateEvent } from './create-event.usecase';
import { Test, TestingModule } from '@nestjs/testing';
import { CreateEventDto } from 'src/application/dtos/events/create-event.dto';
import { EventEntity } from 'src/domain/entities/event.entity';
import { ConfigModule } from 'src/config/config.module';

describe('CreateEvent use case', () => {
    let usecase: CreateEvent;
    let mockEventRepository: jest.Mocked<Pick<EventsRepository, 'create'>>;

    beforeEach(async () => {
        mockEventRepository = {
            create: jest.fn(),
        };

        const module: TestingModule = await Test.createTestingModule({
            providers: [
                CreateEvent,
                {
                    provide: EVENTS_REPOSITORY_TOKEN,
                    useValue: mockEventRepository,
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
            organizer_id: 1,
            start_time: new Date(),
            end_time: new Date(),
            location: 'Test Location',
        };

        const eventEntity: EventEntity = {
            id: 1,
            title: 'Test Event',
            description: 'This is a test event',
            start_time: new Date(),
            organizer_id: 1,
            end_time: new Date(),
            lat: null,
            lng: null,
            venue_id: null,
            categories: [],
            location: 'Test Location',
            created_at: new Date(),
            image_url: null,
        };

        mockEventRepository.create.mockResolvedValue(eventEntity);

        const result = await usecase.execute(data);

        expect(result).toEqual(eventEntity);
    });
});
