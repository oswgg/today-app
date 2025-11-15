import { EventEntity } from './event.entity';
import { UserEntity } from './users';

export interface LocationEntity {
    id: number | bigint;
    name: string;
    address: string;
    city: string | null;
    lat: number;
    lng: number;
    description: string | null;
    phone: string | null;
    website: string | null;
    image_url?: string | null;
    creator_id: number | bigint;
    created_at: Date;

    creator?: UserEntity;
    events?: EventEntity[];
}
