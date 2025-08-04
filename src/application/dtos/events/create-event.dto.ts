export interface CreateEventDto {
    title: string;
    description: string;
    start_time: Date;
    organizer_id: number | bigint;
    end_time?: Date;
    location?: string;
    lat?: number;
    lng?: number;
    categories?: number[];
}
