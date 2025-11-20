import {
    EVENTS_REPOSITORY_TOKEN,
    EventsRepository,
} from 'src/domain/repositories/events.repository';
import { ListAllEvents } from './list-all-events.usecase';
import { Test, TestingModule } from '@nestjs/testing';
import { EventEntity } from 'src/domain/entities/event.entity';
import { ConfigModule } from 'src/config/config.module';

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
            imports: [ConfigModule],
        }).compile();

        useCase = module.get<ListAllEvents>(ListAllEvents);
    });

    it('should return list of events without any filters', async () => {
        const events: EventEntity[] = [
            {
                id: 1,
                title: 'Test Event',
                description: 'This is a test event',
                creator_id: 1,
                start_time: new Date(),
                end_time: new Date(),
                lat: null,
                lng: null,
                location_id: null,
                locationAddress: 'Test Location',
                created_at: new Date(),
                image_url: null,
            },
        ];

        mockEventsRepository.findAll.mockResolvedValue(events);

        const result = await useCase.execute();

        expect(result).toEqual(events);
        expect(mockEventsRepository.findAll).toHaveBeenCalledWith(
            expect.objectContaining({
                where: undefined,
            }),
        );
    });

    it('should return events filtered by creator without position', async () => {
        const events: EventEntity[] = [
            {
                id: 1,
                title: 'Test Event',
                description: 'This is a test event',
                creator_id: 1,
                start_time: new Date(),
                end_time: new Date(),
                lat: null,
                lng: null,
                location_id: null,
                locationAddress: 'Test Location',
                created_at: new Date(),
                image_url: null,
            },
        ];

        mockEventsRepository.findAll.mockResolvedValue(events);

        const result = await useCase.execute({
            filters: {
                where: {
                    creator_id: { operator: 'eq', value: 1 },
                },
            },
        });

        expect(result).toEqual(events);
        expect(mockEventsRepository.findAll).toHaveBeenCalledWith(
            expect.objectContaining({
                where: {
                    creator_id: { operator: 'eq', value: 1 },
                },
            }),
        );
    });

    it('should return events near user position', async () => {
        const events: EventEntity[] = [
            {
                id: 1,
                title: 'Nearby Event',
                description: 'Event close to user',
                creator_id: 1,
                start_time: new Date(),
                end_time: new Date(),
                lat: 40.7128,
                lng: -74.006,
                location_id: null,
                locationAddress: 'Near User',
                created_at: new Date(),
                image_url: null,
            },
        ];

        mockEventsRepository.findAll.mockResolvedValue(events);

        const result = await useCase.execute({
            lat: 40.7128,
            lng: -74.006,
            radius: 10,
        });

        expect(result).toEqual(events);
        expect(mockEventsRepository.findAll).toHaveBeenCalledWith(
            expect.objectContaining({
                where: expect.objectContaining({
                    lat: expect.objectContaining({
                        operator: 'between',
                    }),
                    lng: expect.objectContaining({
                        operator: 'between',
                    }),
                }),
            }),
        );
    });

    it('should combine position and additional filters', async () => {
        const events: EventEntity[] = [];

        mockEventsRepository.findAll.mockResolvedValue(events);

        await useCase.execute({
            lat: 40.7128,
            lng: -74.006,
            radius: 5,
            filters: {
                where: {
                    creator_id: { operator: 'eq', value: 1 },
                },
                limit: 10,
            },
        });

        expect(mockEventsRepository.findAll).toHaveBeenCalledWith(
            expect.objectContaining({
                where: expect.objectContaining({
                    lat: expect.any(Object),
                    lng: expect.any(Object),
                    creator_id: { operator: 'eq', value: 1 },
                }),
                limit: 10,
            }),
        );
    });
});
