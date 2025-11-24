export interface MfaEnrollmentResponse {
    id: string;
    type: string;
    totp?: {
        qr_code: string;
        secret: string;
        uri: string;
    };
}

export interface MfaVerificationResponse {
    valid: boolean;
    message?: string;
}

export interface MfaStatusResponse {
    enabled: boolean;
    factorId: string | null;
    factorType?: string;
}
