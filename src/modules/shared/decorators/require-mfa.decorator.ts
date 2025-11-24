import { SetMetadata } from '@nestjs/common';

export const MFA_REQUIRED_KEY = 'mfaRequired';

/**
 * Decorator to mark a route or controller as requiring MFA verification
 * When applied, users with MFA enabled must provide a valid MFA code
 * in the X-MFA-Token header to access the endpoint
 */
export const MFA = () => SetMetadata(MFA_REQUIRED_KEY, true);
