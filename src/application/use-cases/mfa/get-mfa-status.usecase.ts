import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { MfaStatusResponse } from 'src/application/interfaces/mfa.interface';
import {
    USER_REPO_TOKEN,
    UserRepository,
} from 'src/domain/repositories/user.repository';

@Injectable()
export class GetMfaStatus {
    constructor(
        @Inject(USER_REPO_TOKEN)
        private readonly userRepository: UserRepository,
    ) {}

    async execute(userId: number): Promise<MfaStatusResponse> {
        // Validate user exists
        const user = await this.userRepository.findById(userId);
        if (!user) {
            throw new UnauthorizedException('User not found');
        }

        return {
            enabled: user.mfaEnabled,
            factorId: user.mfaFactorId,
            factorType: user.mfaEnabled ? 'totp' : undefined,
        };
    }
}
