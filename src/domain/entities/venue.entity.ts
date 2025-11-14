import { EventEntity } from './event.entity';
import { UserEntity } from './users';

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
    creator_id: number | bigint;
    created_at: Date;

    creator?: UserEntity;
    events?: EventEntity[];
}
