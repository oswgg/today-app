import { ForbiddenException, Inject, NotFoundException } from '@nestjs/common';
import { I18nService } from 'nestjs-i18n';
import { InputUpdateVenueDto } from 'src/application/dtos/venues/update-venue.dto';
import { FileDestinations } from 'src/config/files.config';
import { VenueEntity } from 'src/domain/entities/venue.entity';
import {
    VENUE_REPO_TOKEN,
    VenueRepository,
} from 'src/domain/repositories/venue.repository';
import {
    FILE_SERVICE_TOKEN,
    FileService,
} from 'src/domain/services/files.service';
import { I18nTranslations } from 'src/i18n/generated/i18n.generated';

export class UpdateVenue {
    constructor(
        @Inject(VENUE_REPO_TOKEN)
        private readonly venueRepository: VenueRepository,
        @Inject(FILE_SERVICE_TOKEN)
        private readonly fileService: FileService,
        private readonly translator: I18nService<I18nTranslations>,
    ) {}

    async execute(id: number, body: InputUpdateVenueDto): Promise<VenueEntity> {
        let imagePath: string | undefined = undefined;

        try {
            if (body.image_url) {
                imagePath = await this.fileService.move(
                    body.image_url,
                    FileDestinations.publicDirectory,
                );
            }

            const venue = await this.venueRepository.findById(id);
            if (!venue) {
                if (body.image_url)
                    await this.fileService.remove(body.image_url);
                throw new NotFoundException(
                    this.translator.t('venues.errors.not_found'),
                );
            }

            if (body.name) {
                const venueWithSameName = await this.venueRepository.findOne({
                    where: {
                        name: body.name,
                        creator_id: venue.creator_id,
                        id: {
                            operator: 'neq',
                            value: id,
                        },
                    },
                });

                if (venueWithSameName) {
                    throw new ForbiddenException(
                        this.translator.t(
                            'venues.errors.already_exists.by_name',
                        ),
                    );
                }
            }

            const updated = await this.venueRepository.updateById(id, {
                name: body.name,
                image_url: imagePath,
            });

            return updated;
        } catch (error) {
            if (imagePath) await this.fileService.remove(imagePath);
            else if (body.image_url)
                await this.fileService.remove(body.image_url);

            throw error;
        }
    }
}
