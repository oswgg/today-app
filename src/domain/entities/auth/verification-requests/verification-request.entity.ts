import { UserRole } from 'src/domain/types/user-role.enum';
import { VerificationRequestDocumentEntity } from './verification-request-document.entity';
import { UserEntity } from '../../users';

export type VerificationRequestStatus = 'PENDING' | 'APPROVED' | 'REJECTED';
export enum VerificationRequestRequestedRole {
    ORGANIZER = UserRole.ORGANIZER,
    INSTITUTION = UserRole.INSTITUTION,
}

export interface VerificationRequestEntity {
    id: number | bigint;
    userId: number | bigint;
    contactName: string;
    phoneNumber: string;
    requestedRole: VerificationRequestRequestedRole;
    businessName: string;
    socialsMediaLinks: string[];
    googleMapsLink: string | null;
    websiteLink: string | null;
    status: VerificationRequestStatus;
    adminNotes: string | null;
    createdAt: Date;
    updatedAt: Date;

    user: UserEntity;
    documents: VerificationRequestDocumentEntity[];
}
