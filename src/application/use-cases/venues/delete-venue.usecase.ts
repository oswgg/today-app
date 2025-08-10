import { Inject, Injectable } from '@nestjs/common';
import {
    VENUE_REPO_TOKEN,
    VenueRepository,
} from 'src/domain/repositories/venue.repository';

@Injectable()
export class DeleteVenue {
    constructor(
        @Inject(VENUE_REPO_TOKEN)
        private readonly venueRepository: VenueRepository,
    ) {}

    async execute(id: number): Promise<void> {
        await this.venueRepository.deleteById(id);
    }
}
