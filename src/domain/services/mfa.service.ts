import {
    MfaEnrollmentResponse,
    MfaVerificationResponse,
} from 'src/application/interfaces/mfa.interface';
import { MfaFactorType } from 'src/application/dtos/auth/mfa-enroll.dto';

export interface MfaService {
    /**
     * Enroll a user in MFA
     * @param userUid - The Supabase UID of the user
     * @param factorType - The type of MFA factor
     * @param supabaseToken - The user's Supabase JWT token
     * @param friendlyName - Optional friendly name for the factor
     * @returns MFA enrollment data
     */
    enroll(
        userUid: string,
        factorType: MfaFactorType,
        supabaseToken: string,
        friendlyName?: string,
    ): Promise<MfaEnrollmentResponse>;

    /**
     * Verify an MFA code and complete enrollment
     * @param factorId - The MFA factor ID
     * @param code - The TOTP code to verify
     * @param supabaseToken - The user's Supabase JWT token
     * @returns Verification result
     */
    verifyAndComplete(
        factorId: string,
        code: string,
        supabaseToken: string,
    ): Promise<MfaVerificationResponse>;

    /**
     * Verify an MFA code during authentication
     * @param factorId - The MFA factor ID
     * @param code - The TOTP code to verify
     * @param supabaseToken - The user's Supabase JWT token
     * @returns Whether the code is valid
     */
    verifyCode(
        factorId: string,
        code: string,
        supabaseToken: string,
    ): Promise<boolean>;

    /**
     * Unenroll (disable) MFA for a user
     * @param factorId - The MFA factor ID to unenroll
     * @param supabaseToken - The user's Supabase JWT token
     * @returns Success status
     */
    unenroll(factorId: string, supabaseToken: string): Promise<void>;
}

export const MFA_SERVICE_TOKEN = Symbol('mfa.service');
