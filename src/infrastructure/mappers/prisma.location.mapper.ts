import { Event, User, Location } from 'generated/prisma';
import { LocationEntity } from 'src/domain/entities/location.entity';
import { PrismaUserMapper } from './prisma.user.mapper';
import { PrismaEventMapper } from './prisma.event.mapper';

export class PrismaLocationMapper {
    static toEntity(
        this: void,
        data: Location & { creator?: User; events?: Event[] },
    ): LocationEntity {
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
