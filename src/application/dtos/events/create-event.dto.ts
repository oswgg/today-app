export interface CreateEventDto {
    title: string;
    description: string;
    start_time: Date;
    venue_id: number;
    creator_id: number | bigint;
    end_time?: Date;
    location?: string;
    lat?: number;
    lng?: number;
    categories?: number[];
}
