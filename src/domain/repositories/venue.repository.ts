import { InputCreateVenueDto } from 'src/application/dtos/venues/create-venue.dto';
import { VenueEntity } from '../entities/venue.entity';
import { EventEntity } from '../entities/event.entity';
import { VenueQueryOptions } from 'src/infrastructure/database/prisma/prisma.venue.repository.impl';

export interface VenueRepository {
    findById(id: number): Promise<VenueEntity | null>;
    findByLocation(
        location: { lat: number; lng: number; radius?: number },
        options?: VenueQueryOptions,
    ): Promise<VenueEntity[]>;
    findOne(options?: VenueQueryOptions): Promise<VenueEntity | null>;
    findAll(options?: VenueQueryOptions): Promise<VenueEntity[]>;
    create(
        venue: InputCreateVenueDto & { organizer_id: number | bigint },
    ): Promise<VenueEntity>;
    getEvents(venue_id: number): Promise<EventEntity[]>;
}

export const VENUE_REPO_TOKEN = Symbol('venue.repository');
