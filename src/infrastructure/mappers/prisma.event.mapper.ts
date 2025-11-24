import {
    Category,
    Event,
    EventCategories,
    User,
    Location,
} from 'generated/prisma';
import { EventEntity } from 'src/domain/entities/event.entity';
import { UserRole } from 'src/domain/types/user-role.enum';

export class PrismaEventMapper {
    static toEntity(
        this: void,
        event: Event & {
            creator?: User;
            categories?: EventCategories[] & { category: Category };
            Location?: Location;
        },
    ): EventEntity {
        return {
            id: event.id,
            title: event.title,
            description: event.description,
            start_time: event.start_time,
            end_time: event.end_time,
            creator_id: event.creator_id,
            location_id: event.location_id,
            locationAddress: event.location,
            lat: event.lat,
            lng: event.lng,
            created_at: event.created_at,
            image_url: event.image_url,
            creator: event.creator
                ? {
                      id: event.creator.id,
                      name: event.creator.name,
                      email: event.creator.email,
                      role: event.creator.role as UserRole,
                      createdAt: event.creator.created_at,
                      uid: event.creator.uid,
                      mfaEnabled: false,
                      mfaFactorId: null,
                      mfaRequired: false,
                  }
                : undefined,
            categories: event.categories
                ? event.categories.map(
                      (cat: EventCategories & { category: Category }) => ({
                          id: cat.category.id,
                          name: cat.category.name,
                          description: cat.category.description,
                      }),
                  )
                : undefined,
            locationEntity: event.Location
                ? {
                      id: event.Location.id,
                      name: event.Location.name,
                      address: event.Location.address,
                      city: event.Location.city,
                      lat: event.Location.lat,
                      lng: event.Location.lng,
                      description: event.Location.description,
                      phone: event.Location.phone,
                      website: event.Location.website,
                      image_url: event.Location.image_url,
                      creator_id: event.Location.creator_id,
                      created_at: event.Location.created_at,
                  }
                : undefined,
        };
    }
}
