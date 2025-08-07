export interface InputCreateVenueDto {
    name: string;
    address: string;
    city: string;
    lat: number;
    lng: number;
    description?: string;
    phone?: string;
    website?: string;
    image_url?: string;
}

export interface OutputCreateVenueDto {
    id: number | bigint;
    name: string;
}
