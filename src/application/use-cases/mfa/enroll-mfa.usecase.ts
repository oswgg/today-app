import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { MfaFactorType } from 'src/application/dtos/auth/mfa-enroll.dto';
import { MfaEnrollmentResponse } from 'src/application/interfaces/mfa.interface';
import {
    USER_REPO_TOKEN,
    UserRepository,
} from 'src/domain/repositories/user.repository';
import { MFA_SERVICE_TOKEN, MfaService } from 'src/domain/services/mfa.service';

@Injectable()
export class EnrollMfa {
    constructor(
        @Inject(MFA_SERVICE_TOKEN)
        private readonly mfaService: MfaService,
        @Inject(USER_REPO_TOKEN)
        private readonly userRepository: UserRepository,
    ) {}

    async execute(
        userId: number,
        factorType: MfaFactorType,
        supabaseToken: string,
        friendlyName?: string,
    ): Promise<MfaEnrollmentResponse> {
        // Validate user exists
        const user = await this.userRepository.findById(userId);
        if (!user) {
            throw new UnauthorizedException('User not found');
        }

        // Validate user has Supabase UID
        if (!user.uid) {
            throw new UnauthorizedException(
                'User must have a Supabase UID to enable MFA',
            );
        }

        // Enroll MFA through the service
        const enrollmentData = await this.mfaService.enroll(
            user.uid,
            factorType,
            supabaseToken,
            friendlyName,
        );

        // Store the factor ID in our database
        await this.userRepository.updateMfaSettings(userId, {
            mfaFactorId: enrollmentData.id,
        });

        return enrollmentData;
    }
}
