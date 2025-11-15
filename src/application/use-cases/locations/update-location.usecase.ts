import { ForbiddenException, Inject, NotFoundException } from '@nestjs/common';
import { I18nService } from 'nestjs-i18n';
import { InputUpdateLocationDto } from 'src/application/dtos/locations/update-location.dto';
import { FileDestinations } from 'src/config/files.config';
import { LocationEntity } from 'src/domain/entities/location.entity';
import {
    LOCATION_REPO_TOKEN,
    LocationRepository,
} from 'src/domain/repositories/location.repository';
import {
    FILE_SERVICE_TOKEN,
    FileService,
} from 'src/domain/services/files.service';
import { I18nTranslations } from 'src/i18n/generated/i18n.generated';

export class UpdateLocation {
    constructor(
        @Inject(LOCATION_REPO_TOKEN)
        private readonly locationRepository: LocationRepository,
        @Inject(FILE_SERVICE_TOKEN)
        private readonly fileService: FileService,
        private readonly translator: I18nService<I18nTranslations>,
    ) {}

    async execute(
        id: number,
        body: InputUpdateLocationDto,
    ): Promise<LocationEntity> {
        let imagePath: string | undefined = undefined;

        try {
            if (body.image_url) {
                imagePath = await this.fileService.move(
                    body.image_url,
                    FileDestinations.publicDirectory,
                );
            }

            const venue = await this.locationRepository.findById(id);
            if (!venue) {
                if (body.image_url)
                    await this.fileService.remove(body.image_url);
                throw new NotFoundException(
                    this.translator.t('locations.errors.not_found'),
                );
            }

            if (body.name) {
                const venueWithSameName = await this.locationRepository.findOne(
                    {
                        where: {
                            name: body.name,
                            creator_id: venue.creator_id,
                            id: {
                                operator: 'neq',
                                value: id,
                            },
                        },
                    },
                );

                if (venueWithSameName) {
                    throw new ForbiddenException(
                        this.translator.t(
                            'locations.errors.already_exists.by_name',
                        ),
                    );
                }
            }

            const updated = await this.locationRepository.updateById(id, {
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
