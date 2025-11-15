import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { LocationEntity } from 'src/domain/entities/location.entity';
import {
    LOCATION_REPO_TOKEN,
    LocationRepository,
} from 'src/domain/repositories/location.repository';
import { I18nService } from 'nestjs-i18n';

@Injectable()
export class GetLocationById {
    constructor(
        @Inject(LOCATION_REPO_TOKEN)
        private locationRepository: LocationRepository,
        private readonly i18n: I18nService,
    ) {}

    async execute(id: number): Promise<LocationEntity> {
        const location = await this.locationRepository.findOne({
            where: { id: { operator: 'eq', value: id } },
            include: [
                {
                    model: 'creator',
                },
                {
                    model: 'events',
                },
            ],
        });

        if (!location) {
            throw new NotFoundException(
                await this.i18n.translate('locations.errors.not_found'),
            );
        }

        return location;
    }
}
