import { Injectable, UnauthorizedException } from '@nestjs/common';
import { createClient } from '@supabase/supabase-js';
import { SupabaseConfig } from 'src/config/supabase.config';
import {
    MfaEnrollmentResponse,
    MfaVerificationResponse,
} from 'src/application/interfaces/mfa.interface';
import { MfaFactorType } from 'src/application/dtos/auth/mfa-enroll.dto';
import { MfaService } from 'src/domain/services/mfa.service';

@Injectable()
export class SupabaseMfaService implements MfaService {
    constructor(private readonly supabaseConfig: SupabaseConfig) {}

    /**
     * Create a Supabase client with the user's session token
     */
    private createAuthenticatedClient(supabaseToken: string) {
        return createClient(
            this.supabaseConfig.supabaseUrl,
            this.supabaseConfig.supabaseKey,
            {
                global: {
                    headers: {
                        Authorization: `Bearer ${supabaseToken}`,
                    },
                },
            },
        );
    }

    async enroll(
        userUid: string,
        factorType: MfaFactorType,
        supabaseToken: string,
        friendlyName?: string,
    ): Promise<MfaEnrollmentResponse> {
        const userClient = this.createAuthenticatedClient(supabaseToken);

        const { data, error } = await userClient.auth.mfa.enroll({
            factorType,
            friendlyName,
        });

        if (error) {
            throw new UnauthorizedException(
                `MFA enrollment failed: ${error.message}`,
            );
        }

        return {
            id: data.id,
            type: data.type,
            totp: data.totp,
        };
    }

    async verifyAndComplete(
        factorId: string,
        code: string,
        supabaseToken: string,
    ): Promise<MfaVerificationResponse> {
        const userClient = this.createAuthenticatedClient(supabaseToken);

        // Create a challenge first
        const { data: challengeData, error: challengeError } =
            await userClient.auth.mfa.challenge({
                factorId,
            });

        if (challengeError) {
            return {
                valid: false,
                message:
                    challengeError.message || 'Failed to create MFA challenge',
            };
        }

        // Verify the code
        const { error: verifyError } = await userClient.auth.mfa.verify({
            factorId,
            challengeId: challengeData.id,
            code,
        });

        if (verifyError) {
            return {
                valid: false,
                message: verifyError.message || 'Invalid MFA code',
            };
        }

        return {
            valid: true,
            message: 'MFA verified successfully',
        };
    }

    async verifyCode(
        factorId: string,
        code: string,
        supabaseToken: string,
    ): Promise<boolean> {
        try {
            const userClient = this.createAuthenticatedClient(supabaseToken);

            // Create a challenge first
            const { data: challengeData, error: challengeError } =
                await userClient.auth.mfa.challenge({
                    factorId,
                });

            if (challengeError) {
                return false;
            }

            // Verify the code
            const { error: verifyError } = await userClient.auth.mfa.verify({
                factorId,
                challengeId: challengeData.id,
                code,
            });

            return !verifyError;
        } catch (error) {
            return false;
        }
    }

    async unenroll(factorId: string, supabaseToken: string): Promise<void> {
        const userClient = this.createAuthenticatedClient(supabaseToken);

        const { error } = await userClient.auth.mfa.unenroll({
            factorId,
        });

        if (error) {
            throw new UnauthorizedException(
                `MFA unenrollment failed: ${error.message}`,
            );
        }
    }
}
