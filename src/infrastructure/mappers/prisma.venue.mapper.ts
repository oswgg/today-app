import { Event, User, Venue } from 'generated/prisma';
import { VenueEntity } from 'src/domain/entities/venue.entity';
import { PrismaUserMapper } from './prisma.user.mapper';
import { PrismaEventMapper } from './prisma.event.mapper';

export class PrismaVenueMapper {
    static toEntity(
        this: void,
        data: Venue & { organizer?: User; events?: Event[] },
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
            image_url: data.image_url,
            organizer_id: data.organizer_id,
            created_at: new Date(data.created_at),
            organizer: data.organizer
                ? PrismaUserMapper.toOrganizerEntity(data.organizer)
                : undefined,
            events: data.events
                ? data.events.map(PrismaEventMapper.toEntity)
                : undefined,
        };
    }
}
