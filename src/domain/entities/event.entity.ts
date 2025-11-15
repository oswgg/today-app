import { CategoryEntity } from './category.entity';
import { UserEntity } from './users';
import { LocationEntity } from './location.entity';

export interface EventEntity {
    id: number | bigint;
    title: string;
    creator_id: number | bigint;
    location_id: number | bigint | null;
    description: string | null;
    start_time: Date;
    end_time: Date | null;
    locationAddress: string | null;
    lat: number | null;
    lng: number | null;
    created_at: Date;
    image_url: string | null;

    creator?: UserEntity;
    categories?: CategoryEntity[];
    locationEntity?: LocationEntity;
}
