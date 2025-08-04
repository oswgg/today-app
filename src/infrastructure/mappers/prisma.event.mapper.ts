import { Category, Event, EventCategories, User } from 'generated/prisma';
import { EventEntity } from 'src/domain/entities/event.entity';
import { UserRole } from 'src/domain/types/user-role.enum';

export class PrismaEventMapper {
    static toEntity(
        this: void,
        event: Event & {
            organizer?: User;
            categories?: EventCategories[] & { category: Category };
        },
    ): EventEntity {
        return {
            id: event.id,
            title: event.title,
            description: event.description,
            start_time: event.start_time,
            end_time: event.end_time,
            organizer_id: event.organizer_id,
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
        };
    }
}
