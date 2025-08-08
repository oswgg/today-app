import { ForbiddenException, Inject, NotFoundException } from '@nestjs/common';
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

export class UpdateVenue {
    constructor(
        @Inject(VENUE_REPO_TOKEN)
        private readonly venueRepository: VenueRepository,
        @Inject(FILE_SERVICE_TOKEN)
        private readonly fileService: FileService,
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
                throw new NotFoundException('Venue not found');
            }

            if (body.name) {
                const venueWithSameName = await this.venueRepository.findOne({
                    where: {
                        name: body.name,
                        organizer_id: venue.organizer_id,
                        id: {
                            operator: 'neq',
                            value: id,
                        },
                    },
                });

                if (venueWithSameName) {
                    throw new ForbiddenException(
                        'Venue with the same name already exists',
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
