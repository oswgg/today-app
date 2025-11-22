export type VerificationRequestDocumentType = 'ID_DOCUMENT';

export interface VerificationRequestDocumentEntity {
    id: number | bigint;
    requestId: number | bigint;
    url: string;
    fileType: VerificationRequestDocumentType;
    uploadedAt: Date;
}
