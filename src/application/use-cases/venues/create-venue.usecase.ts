import { ForbiddenException, Inject, Injectable } from '@nestjs/common';
import {
    InputCreateVenueDto,
    OutputCreateVenueDto,
} from 'src/application/dtos/venues/create-venue.dto';
import {
    VENUE_REPO_TOKEN,
    VenueRepository,
} from 'src/domain/repositories/venue.repository';

@Injectable()
export class CreateVenue {
    constructor(
        @Inject(VENUE_REPO_TOKEN)
        private readonly venueRepo: VenueRepository,
    ) {}

    async execute(
        input: InputCreateVenueDto & { organizer_id: number | bigint },
    ): Promise<OutputCreateVenueDto> {
        const venuesAtSameLocation = await this.venueRepo.findByLocation(
            {
                lat: input.lat,
                lng: input.lng,
            },
            {
                where: {
                    organizer_id: input.organizer_id,
                },
            },
        );

        if (venuesAtSameLocation.length > 0) {
            throw new ForbiddenException(
                'A venue already exists at the given location.',
            );
        }

        const venueWithSameName = await this.venueRepo.findOne({
            where: {
                name: input.name,
                organizer_id: input.organizer_id,
            },
        });

        if (venueWithSameName) {
            throw new ForbiddenException(
                'A venue with the same name already exists for the given organizer.',
            );
        }

        const venue = await this.venueRepo.create(input);
        return venue;
    }
}
