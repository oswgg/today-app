import { VerificationRequestsRepository } from 'src/domain/repositories/verification-requests.repo';
import { PrismaService } from './prisma.service';
import { VerificationRequestEntity } from 'src/domain/entities/auth/verification-requests/verification-request.entity';
import { QueryOptions } from 'src/application/dtos/shared/query-options.dto';
import { Prisma } from 'generated/prisma';
import { CreateVerificationRequestDto } from 'src/application/dtos/auth/verification-requests/create-verification.dto';
import { PrismaVerificationRequestMapper } from 'src/infrastructure/mappers/verification-requests.mapper';

export type VerificationRequestQueryOptions =
    QueryOptions<VerificationRequestEntity>;

export class PrismaVerificationRequestRespositoryImpl
    extends PrismaService<
        VerificationRequestEntity,
        Prisma.VerificationRequestFindManyArgs
    >
    implements VerificationRequestsRepository
{
    async findById(
        id: number | bigint,
    ): Promise<VerificationRequestEntity | null> {
        const request = await this.verificationRequest.findUnique({
            where: { id: Number(id) },
        });

        return request
            ? PrismaVerificationRequestMapper.toEntity(request)
            : null;
    }

    async findByUserId(
        userId: number | bigint,
    ): Promise<VerificationRequestEntity | null> {
        const request = await this.verificationRequest.findFirst({
            where: { user_id: BigInt(userId) },
        });

        return request
            ? PrismaVerificationRequestMapper.toEntity(request)
            : null;
    }

    async create(
        data: CreateVerificationRequestDto,
    ): Promise<VerificationRequestEntity> {
        const request = await this.verificationRequest.create({
            data: {
                user_id: BigInt(data.userId),
                documents: {
                    createMany: {
                        data: data.documents.map((doc) => ({
                            url: doc.url,
                            type: doc.fileType,
                        })),
                    },
                },
                contact_name: data.contactName,
                phone_number: data.phoneNumber,
                requested_role: data.requestedRole,
                business_name: data.businessName,
                socials_networks: data.socialsMediaLinks,
                google_maps_url: data.googleMapsLink,
                website_url: data.websiteLink,
            },
        });

        return PrismaVerificationRequestMapper.toEntity(request);
    }

    async changeStatus(
        id: number | bigint,
        status: 'APPROVED' | 'REJECTED',
        adminNotes?: string,
    ): Promise<VerificationRequestEntity> {
        const request = await this.verificationRequest.update({
            where: { id: Number(id) },
            data: {
                status,
                admin_notes: adminNotes,
            },
        });

        return PrismaVerificationRequestMapper.toEntity(request);
    }
}
