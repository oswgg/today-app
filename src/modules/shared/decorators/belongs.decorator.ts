import { SetMetadata } from '@nestjs/common';
import { Path } from 'nestjs-i18n';
import { I18nTranslations } from 'src/i18n/generated/i18n.generated';

// El decorador acepta un tipo genérico T, pero TS solo lo fuerza al usarlo
export const BELONGS_TO_KEY = 'belongsTo';

export type BelongsToOptions = {
    table: string;
    owner: string;
    identify: string;
    entity?: string;
    message_path?: Path<I18nTranslations>;
};
export const BelongsTo = (options: BelongsToOptions) =>
    SetMetadata(BELONGS_TO_KEY, options);
