import { SetMetadata } from '@nestjs/common';

// El decorador acepta un tipo genérico T, pero TS solo lo fuerza al usarlo
export const BELONGS_TO_KEY = 'belongsTo';
export const BelongsTo = (options: {
    table: string;
    owner: string;
    identify: string;
    entity: string;
}) => SetMetadata(BELONGS_TO_KEY, options);
