import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { MfaVerificationResponse } from 'src/application/interfaces/mfa.interface';
import {
    USER_REPO_TOKEN,
    UserRepository,
} from 'src/domain/repositories/user.repository';
import { MFA_SERVICE_TOKEN, MfaService } from 'src/domain/services/mfa.service';

@Injectable()
export class VerifyAndEnableMfa {
    constructor(
        @Inject(MFA_SERVICE_TOKEN)
        private readonly mfaService: MfaService,
        @Inject(USER_REPO_TOKEN)
        private readonly userRepository: UserRepository,
    ) {}

    async execute(
        userId: number,
        factorId: string,
        code: string,
        supabaseToken: string,
    ): Promise<MfaVerificationResponse> {
        // Validate user exists
        const user = await this.userRepository.findById(userId);
        if (!user) {
            throw new UnauthorizedException('User not found');
        }

        // Validate user has Supabase UID
        if (!user.uid) {
            throw new UnauthorizedException(
                'User must have a Supabase UID to verify MFA',
            );
        }

        // Verify the MFA code through the service
        const verificationResult = await this.mfaService.verifyAndComplete(
            factorId,
            code,
            supabaseToken,
        );

        // If verification succeeded, enable MFA for the user
        if (verificationResult.valid) {
            await this.userRepository.updateMfaSettings(userId, {
                mfaEnabled: true,
                mfaFactorId: factorId,
            });
        }

        return verificationResult;
    }
}
