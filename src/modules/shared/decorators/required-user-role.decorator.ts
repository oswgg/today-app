import { SetMetadata } from '@nestjs/common';
import { Path } from 'nestjs-i18n';
import { UserRole } from 'src/domain/types/user-role.enum';
import { I18nTranslations } from 'src/i18n/generated/i18n.generated';

// El decorador acepta un tipo genérico T, pero TS solo lo fuerza al usarlo
export const REQUIRED_ROLE_KEY = 'requiredUserRole';

export type RequiredRoleOptions = UserRole[];

export const RequiredRole = (options: RequiredRoleOptions) =>
    SetMetadata(REQUIRED_ROLE_KEY, options);
