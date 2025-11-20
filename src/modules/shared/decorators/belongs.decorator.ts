import { SetMetadata } from '@nestjs/common';
import { Path } from 'nestjs-i18n';
import { I18nTranslations } from 'src/i18n/generated/i18n.generated';

// El decorador acepta un tipo genérico T, pero TS solo lo fuerza al usarlo
export const BELONGS_TO_KEY = 'belongsTo';

export type BelongsToOptions = {
    /** Name of the table to check ownership against */
    table: string;
    /** Column name that identifies the owner in the table */
    owner: string;
    /** Column name used to identify the resource */
    identify: string;
    /** Name of the entity (for error messages) */
    entity?: string;
    /** Optional i18n path for custom "not found" message */
    message_path?: Path<I18nTranslations>;
};
export const BelongsTo = (options: BelongsToOptions) =>
    SetMetadata(BELONGS_TO_KEY, options);
