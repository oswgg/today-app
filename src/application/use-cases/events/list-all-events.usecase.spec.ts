import {
    EVENTS_REPOSITORY_TOKEN,
    EventsRepository,
} from 'src/domain/repositories/events.repository';
import { ListAllEvents } from './list-all-events.usecase';
import { Test, TestingModule } from '@nestjs/testing';
import { EventEntity } from 'src/domain/entities/event.entity';

describe('ListAllEvents use case', () => {
    let useCase: ListAllEvents;
    let mockEventsRepository: jest.Mocked<Pick<EventsRepository, 'findAll'>>;

    beforeEach(async () => {
        mockEventsRepository = {
            findAll: jest.fn(),
        };

        const module: TestingModule = await Test.createTestingModule({
            providers: [
                ListAllEvents,
                {
                    provide: EVENTS_REPOSITORY_TOKEN,
                    useValue: mockEventsRepository,
                },
            ],
        }).compile();

        useCase = module.get<ListAllEvents>(ListAllEvents);
    });

    it('should return list of events', async () => {
        const events: EventEntity[] = [
            {
                id: 1,
                title: 'Test Event',
                description: 'This is a test event',
                organizer_id: 1,
                start_time: new Date(),
                end_time: new Date(),
                lat: null,
                lng: null,
                location: 'Test Location',
                created_at: new Date(),
            },
        ];

        mockEventsRepository.findAll.mockResolvedValue(events);

        const result = await useCase.execute();

        expect(result).toEqual(events);
    });
});
