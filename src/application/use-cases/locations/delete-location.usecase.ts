import { Inject, Injectable } from '@nestjs/common';
import {
    LOCATION_REPO_TOKEN,
    LocationRepository,
} from 'src/domain/repositories/location.repository';

@Injectable()
export class DeleteLocation {
    constructor(
        @Inject(LOCATION_REPO_TOKEN)
        private readonly locationRepository: LocationRepository,
    ) {}

    async execute(id: number): Promise<void> {
        await this.locationRepository.deleteById(id);
    }
}
