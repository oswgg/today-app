import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';
import { DeleteEvent } from './delete-event.usecase';
import {
    EVENTS_REPOSITORY_TOKEN,
    EventsRepository,
} from 'src/domain/repositories/events.repository';
import { I18nService } from 'nestjs-i18n';
import { EventEntity } from 'src/domain/entities/event.entity';

describe('DeleteEvent use case', () => {
    let useCase: DeleteEvent;
    let mockEventsRepository: jest.Mocked<
        Pick<EventsRepository, 'findById' | 'deleteById'>
    >;
    let mockI18nService: jest.Mocked<Pick<I18nService, 't'>>;

    beforeEach(async () => {
        mockEventsRepository = {
            findById: jest.fn(),
            deleteById: jest.fn(),
        };

        mockI18nService = {
            t: jest.fn().mockReturnValue('Event not found'),
        };

        const module: TestingModule = await Test.createTestingModule({
            providers: [
                DeleteEvent,
                {
                    provide: EVENTS_REPOSITORY_TOKEN,
                    useValue: mockEventsRepository,
                },
                {
                    provide: I18nService,
                    useValue: mockI18nService,
                },
            ],
        }).compile();

        useCase = module.get<DeleteEvent>(DeleteEvent);
    });

    it('should successfully delete an existing event', async () => {
        const eventId = 1;
        const mockEvent: EventEntity = {
            id: eventId,
            title: 'Test Event',
            description: 'Test Description',
            creator_id: 1,
            start_time: new Date(),
            end_time: new Date(),
            lat: null,
            lng: null,
            location_id: 1,
            locationAddress: 'Test Location',
            created_at: new Date(),
            image_url: null,
        };

        mockEventsRepository.findById.mockResolvedValue(mockEvent);
        mockEventsRepository.deleteById.mockResolvedValue(undefined);

        await useCase.execute(eventId);

        expect(mockEventsRepository.findById).toHaveBeenCalledWith(eventId);
        expect(mockEventsRepository.deleteById).toHaveBeenCalledWith(eventId);
    });

    it('should throw NotFoundException when event does not exist', async () => {
        const eventId = 999;

        mockEventsRepository.findById.mockResolvedValue(null);

        await expect(useCase.execute(eventId)).rejects.toThrow(
            NotFoundException,
        );

        expect(mockEventsRepository.findById).toHaveBeenCalledWith(eventId);
        expect(mockEventsRepository.deleteById).not.toHaveBeenCalled();
        expect(mockI18nService.t).toHaveBeenCalledWith(
            'events.errors.event_not_found',
        );
    });

    it('should propagate repository errors', async () => {
        const eventId = 1;
        const mockEvent: EventEntity = {
            id: eventId,
            title: 'Test Event',
            description: 'Test Description',
            creator_id: 1,
            start_time: new Date(),
            end_time: new Date(),
            lat: null,
            lng: null,
            location_id: 1,
            locationAddress: 'Test Location',
            created_at: new Date(),
            image_url: null,
        };

        mockEventsRepository.findById.mockResolvedValue(mockEvent);
        mockEventsRepository.deleteById.mockRejectedValue(
            new Error('Database error'),
        );

        await expect(useCase.execute(eventId)).rejects.toThrow(
            'Database error',
        );

        expect(mockEventsRepository.findById).toHaveBeenCalledWith(eventId);
        expect(mockEventsRepository.deleteById).toHaveBeenCalledWith(eventId);
    });
});
