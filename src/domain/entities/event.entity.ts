import { CategoryEntity } from './category.entity';
import { OrganizerEntity } from './organizer.entity';
import { VenueEntity } from './venue.entity';

export interface EventEntity {
    id: number | bigint;
    title: string;
    organizer_id: number | bigint;
    venue_id: number | bigint | null;
    description: string | null;
    start_time: Date;
    end_time: Date | null;
    location: string | null;
    lat: number | null;
    lng: number | null;
    created_at: Date;

    organizer?: OrganizerEntity;
    categories?: CategoryEntity[];
    venue?: VenueEntity;
}
