import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import {
    USER_REPO_TOKEN,
    UserRepository,
} from 'src/domain/repositories/user.repository';
import { MFA_SERVICE_TOKEN, MfaService } from 'src/domain/services/mfa.service';

@Injectable()
export class UnenrollMfa {
    constructor(
        @Inject(MFA_SERVICE_TOKEN)
        private readonly mfaService: MfaService,
        @Inject(USER_REPO_TOKEN)
        private readonly userRepository: UserRepository,
    ) {}

    async execute(
        userId: number,
        supabaseToken: string,
    ): Promise<{ success: boolean }> {
        // Validate user exists
        const user = await this.userRepository.findById(userId);
        if (!user) {
            throw new UnauthorizedException('User not found');
        }

        // Validate MFA is enabled
        if (!user.mfaEnabled || !user.mfaFactorId) {
            throw new UnauthorizedException('MFA is not enabled for this user');
        }

        // Validate user has Supabase UID
        if (!user.uid) {
            throw new UnauthorizedException(
                'User must have a Supabase UID to unenroll MFA',
            );
        }

        // Unenroll through the service
        await this.mfaService.unenroll(user.mfaFactorId, supabaseToken);

        // Update user to disable MFA
        await this.userRepository.updateMfaSettings(userId, {
            mfaEnabled: false,
            mfaFactorId: null,
        });

        return { success: true };
    }
}
