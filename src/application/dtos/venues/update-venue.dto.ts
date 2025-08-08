import { InputCreateVenueDto } from './create-venue.dto';

export interface InputUpdateVenueDto
    extends Partial<Omit<InputCreateVenueDto, 'lat' | 'lng'>> {}

export interface OutputUpdateVenueDto {
    id: number;
    name: string;
    image: string;
}
