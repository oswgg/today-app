import { SetMetadata } from '@nestjs/common';

export const SKIP_MFA_KEY = 'skipMfa';

/**
 * Decorator to skip MFA verification on specific routes
 * within a controller that has @MFARequired() applied
 * Similar to how @Public() works with @UseGuards(AuthGuard)
 */
export const SkipMFA = () => SetMetadata(SKIP_MFA_KEY, true);
