export interface CreateEventDto {
    title: string;
    description: string;
    start_time: Date;
    end_time?: Date;
    location?: string;
}
