import { Inject } from '@nestjs/common';
import { EventEntity } from 'src/domain/entities/event.entity';
import {
    EVENTS_REPOSITORY_TOKEN,
    EventsRepository,
} from 'src/domain/repositories/events.repository';
import { boundingBox } from 'src/domain/shared/utils/bounding-box';

export class ListAllEvents {
    constructor(
        @Inject(EVENTS_REPOSITORY_TOKEN)
        private readonly eventsRepository: EventsRepository,
    ) {}

    async execute(
        lat?: number,
        lng?: number,
        radius: number = 5,
        unit: string = 'km',
    ): Promise<EventEntity[]> {
        let bounding:
            | {
                  min_lat: number;
                  max_lat: number;
                  min_lng: number;
                  max_lng: number;
              }
            | undefined = undefined;

        if (lat && lng) {
            bounding = boundingBox(lat, lng, radius);
        }

        return await this.eventsRepository.findAll({
            where: bounding
                ? {
                      lat: {
                          operator: 'between',
                          value: [bounding.min_lat, bounding.max_lat],
                      },
                      lng: {
                          operator: 'between',
                          value: [bounding.min_lng, bounding.max_lng],
                      },
                  }
                : undefined,
            include: [
                {
                    model: 'organizer',
                    select: ['id', 'name'],
                },
                {
                    model: 'categories',
                    include: [
                        {
                            model: 'category',
                            select: ['id', 'name', 'description'],
                        },
                    ],
                },
            ],
        });
    }
}
