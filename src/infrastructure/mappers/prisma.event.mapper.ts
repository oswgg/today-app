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
            organizer?: User;
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
            organizer_id: event.organizer_id,
            venue_id: event.venue_id,
            location: event.location,
            lat: event.lat,
            lng: event.lng,
            created_at: event.created_at,
            organizer: event.organizer
                ? {
                      id: event.organizer.id,
                      name: event.organizer.name,
                      email: event.organizer.email,
                      role: event.organizer.role as UserRole.ORGANIZER,
                      createdAt: event.organizer.created_at,
                      uid: event.organizer.uid,
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
                      image_url: event.venue.image_url,
                      organizer_id: event.venue.organizer_id,
                      created_at: event.venue.created_at,
                  }
                : undefined,
        };
    }
}
