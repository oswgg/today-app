export interface EventEntity {
    id: number | bigint;
    title: string;
    description: string | null;
    start_time: Date;
    end_time: Date | null;
    location: string | null;
    created_at: Date;
}
