import { Event, User, Venue } from 'generated/prisma';
import { VenueEntity } from 'src/domain/entities/venue.entity';
import { PrismaUserMapper } from './prisma.user.mapper';
import { PrismaEventMapper } from './prisma.event.mapper';

export class PrismaVenueMapper {
    static toEntity(
        this: void,
        data: Venue & { creator?: User; events?: Event[] },
    ): VenueEntity {
        return {
            id: data.id,
            name: data.name,
            address: data.address,
            city: data.city,
            lat: data.lat,
            lng: data.lng,
            description: data.description,
            phone: data.phone,
            website: data.website,
            creator_id: data.creator_id,
            created_at: new Date(data.created_at),
            creator: data.creator
                ? PrismaUserMapper.toEntity(data.creator)
                : undefined,
            events: data.events
                ? data.events.map(PrismaEventMapper.toEntity)
                : undefined,
        };
    }
}
