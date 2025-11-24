import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import {
    USER_REPO_TOKEN,
    UserRepository,
} from 'src/domain/repositories/user.repository';
import { MFA_SERVICE_TOKEN, MfaService } from 'src/domain/services/mfa.service';

@Injectable()
export class VerifyMfaCode {
    constructor(
        @Inject(MFA_SERVICE_TOKEN)
        private readonly mfaService: MfaService,
        @Inject(USER_REPO_TOKEN)
        private readonly userRepository: UserRepository,
    ) {}

    async execute(
        userId: number,
        code: string,
        supabaseToken: string,
    ): Promise<boolean> {
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
                'User must have a Supabase UID to verify MFA',
            );
        }

        // Verify the code through the service
        return await this.mfaService.verifyCode(
            user.mfaFactorId,
            code,
            supabaseToken,
        );
    }
}
