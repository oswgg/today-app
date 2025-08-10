import { ForbiddenException, Inject, Injectable } from '@nestjs/common';
import { I18nService } from 'nestjs-i18n';
import {
    InputCreateVenueDto,
    OutputCreateVenueDto,
} from 'src/application/dtos/venues/create-venue.dto';
import {
    VENUE_REPO_TOKEN,
    VenueRepository,
} from 'src/domain/repositories/venue.repository';
import { I18nTranslations } from 'src/i18n/generated/i18n.generated';

@Injectable()
export class CreateVenue {
    constructor(
        @Inject(VENUE_REPO_TOKEN)
        private readonly venueRepo: VenueRepository,
        private readonly translator: I18nService<I18nTranslations>,
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
                this.translator.t('venues.errors.already_exists.by_location'),
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
                this.translator.t('venues.errors.already_exists.by_name'),
            );
        }

        const venue = await this.venueRepo.create(input);
        return venue;
    }
}
