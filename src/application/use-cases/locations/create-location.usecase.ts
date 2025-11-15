import { ForbiddenException, Inject, Injectable } from '@nestjs/common';
import { I18nService } from 'nestjs-i18n';
import {
    InputCreateLocationDto,
    OutputCreateLocationDto,
} from 'src/application/dtos/locations/create-location.dto';
import { FileDestinations } from 'src/config/files.config';
import {
    LOCATION_REPO_TOKEN,
    LocationRepository,
} from 'src/domain/repositories/location.repository';
import {
    FILE_SERVICE_TOKEN,
    FileService,
} from 'src/domain/services/files.service';
import { I18nTranslations } from 'src/i18n/generated/i18n.generated';

@Injectable()
export class CreateLocation {
    constructor(
        @Inject(LOCATION_REPO_TOKEN)
        private readonly locationRepo: LocationRepository,
        @Inject(FILE_SERVICE_TOKEN)
        private readonly fileService: FileService,
        private readonly translator: I18nService<I18nTranslations>,
    ) {}
    async execute(
        input: InputCreateLocationDto & { creator_id: number | bigint },
    ): Promise<OutputCreateLocationDto> {
        let imagePath: string | undefined = undefined;

        try {
            if (input.image_url) {
                imagePath = await this.fileService.move(
                    input.image_url,
                    FileDestinations.publicDirectory,
                );
            }

            const venuesAtSameLocation = await this.locationRepo.findByLocation(
                {
                    lat: input.lat,
                    lng: input.lng,
                },
                {
                    where: {
                        creator_id: input.creator_id,
                    },
                },
            );

            if (venuesAtSameLocation.length > 0) {
                throw new ForbiddenException(
                    this.translator.t(
                        'locations.errors.already_exists.by_location',
                    ),
                );
            }

            const venueWithSameName = await this.locationRepo.findOne({
                where: {
                    name: input.name,
                    creator_id: input.creator_id,
                },
            });

            if (venueWithSameName) {
                throw new ForbiddenException(
                    this.translator.t(
                        'locations.errors.already_exists.by_name',
                    ),
                );
            }

            const venue = await this.locationRepo.create({
                ...input,
                image_url: imagePath,
            });
            return venue;
        } catch (error) {
            if (imagePath) await this.fileService.remove(imagePath);
            else if (input.image_url)
                await this.fileService.remove(input.image_url);

            throw error;
        }
    }
}
