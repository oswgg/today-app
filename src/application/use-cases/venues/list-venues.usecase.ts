import { Inject, Injectable } from '@nestjs/common';
import { VenueEntity } from 'src/domain/entities/venue.entity';
import {
    VENUE_REPO_TOKEN,
    VenueRepository,
} from 'src/domain/repositories/venue.repository';

@Injectable()
export class ListVenues {
    constructor(
        @Inject(VENUE_REPO_TOKEN) private venueRepository: VenueRepository,
    ) {}

    async execute(): Promise<VenueEntity[]> {
        return await this.venueRepository.findAll({
            include: [
                {
                    model: 'creator',
                },
                {
                    model: 'events',
                },
            ],
        });
    }
}
