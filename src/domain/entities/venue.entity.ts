import { EventEntity } from './event.entity';
import { OrganizerEntity } from './organizer.entity';

export interface VenueEntity {
    id: number | bigint;
    name: string;
    address: string;
    city: string | null;
    lat: number;
    lng: number;
    description: string | null;
    phone: string | null;
    website: string | null;
    image_url: string | null;
    organizer_id: number | bigint;
    created_at: Date;

    organizer?: OrganizerEntity;
    events?: EventEntity[];
}
