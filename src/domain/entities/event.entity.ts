import { CategoryEntity } from './category.entity';
import { UserEntity } from './users';
import { VenueEntity } from './venue.entity';

export interface EventEntity {
    id: number | bigint;
    title: string;
    creator_id: number | bigint;
    venue_id: number | bigint | null;
    description: string | null;
    start_time: Date;
    end_time: Date | null;
    location: string | null;
    lat: number | null;
    lng: number | null;
    created_at: Date;
    image_url: string | null;

    creator?: UserEntity;
    categories?: CategoryEntity[];
    venue?: VenueEntity;
}
