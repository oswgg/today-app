import { VerificationRequestDocumentEntity } from 'src/domain/entities/auth/verification-requests/verification-request-document.entity';
import { VerificationRequestRequestedRole } from 'src/domain/entities/auth/verification-requests/verification-request.entity';

export interface CreateVerificationRequestDto {
    userId: number | bigint;
    contactName: string;
    phoneNumber: string;
    requestedRole: VerificationRequestRequestedRole;
    businessName: string;
    socialsMediaLinks: string[];
    googleMapsLink: string | null;
    websiteLink: string | null;

    documents: VerificationRequestDocumentEntity[];
}
