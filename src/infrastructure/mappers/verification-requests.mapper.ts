import {
    VerificationRequest,
    User,
    VerificationDocument,
} from 'generated/prisma';
import {
    VerificationRequestEntity,
    VerificationRequestRequestedRole,
} from 'src/domain/entities/auth/verification-requests/verification-request.entity';
import { VerificationRequestDocumentEntity } from 'src/domain/entities/auth/verification-requests/verification-request-document.entity';
import { PrismaUserMapper } from './prisma.user.mapper';

export class PrismaVerificationRequestMapper {
    static toEntity(
        this: void,
        data: VerificationRequest & {
            user?: User;
            documents?: VerificationDocument[];
        },
    ): VerificationRequestEntity {
        const documents: VerificationRequestDocumentEntity[] =
            data.documents?.map((doc) => ({
                id: doc.id,
                requestId: doc.request_id,
                url: doc.url,
                fileType: (doc.file_type as any) ?? 'ID_DOCUMENT',
                uploadedAt: doc.uploaded_at,
            })) ?? [];

        return {
            id: data.id,
            userId: data.user_id,
            contactName: data.contact_name,
            phoneNumber: data.phone_number,
            requestedRole:
                data.requested_role as VerificationRequestRequestedRole,
            businessName: data.business_name,
            socialsMediaLinks: data.socials_networks,
            googleMapsLink: data.google_maps_url,
            websiteLink: data.website_url,
            status: data.status,
            adminNotes: data.admin_notes,
            createdAt: data.created_at,
            updatedAt: data.updated_at,
            user: data.user
                ? PrismaUserMapper.toEntity(data.user)
                : ({} as any),
            documents,
        };
    }
}
