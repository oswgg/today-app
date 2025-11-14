import {
    Category,
    Event,
    EventCategories,
    User,
    Venue,
} from 'generated/prisma';
import { EventEntity } from 'src/domain/entities/event.entity';
import { UserRole } from 'src/domain/types/user-role.enum';

export class PrismaEventMapper {
    static toEntity(
        this: void,
        event: Event & {
            creator?: User;
            categories?: EventCategories[] & { category: Category };
            venue?: Venue;
        },
    ): EventEntity {
        return {
            id: event.id,
            title: event.title,
            description: event.description,
            start_time: event.start_time,
            end_time: event.end_time,
            creator_id: event.creator_id,
            venue_id: event.venue_id,
            location: event.location,
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
            venue: event.venue
                ? {
                      id: event.venue.id,
                      name: event.venue.name,
                      address: event.venue.address,
                      city: event.venue.city,
                      lat: event.venue.lat,
                      lng: event.venue.lng,
                      description: event.venue.description,
                      phone: event.venue.phone,
                      website: event.venue.website,
                      creator_id: event.venue.creator_id,
                      created_at: event.venue.created_at,
                  }
                : undefined,
        };
    }
}
