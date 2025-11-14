import { UserEntity } from './user.entity';

export class InstitutionEntity extends UserEntity {
    description?: string;
    website?: string;
}
