import { CreateVerificationRequestDto } from 'src/application/dtos/auth/verification-requests/create-verification.dto';
import { VerificationRequestEntity } from '../entities/auth/verification-requests/verification-request.entity';

export interface VerificationRequestsRepository {
    create(
        data: CreateVerificationRequestDto,
    ): Promise<VerificationRequestEntity>;
    findById(id: number | bigint): Promise<VerificationRequestEntity | null>;
    findByUserId(
        userId: number | bigint,
    ): Promise<VerificationRequestEntity | null>;
    changeStatus(
        id: number | bigint,
        status: 'APPROVED' | 'REJECTED',
        adminNotes?: string,
    ): Promise<VerificationRequestEntity>;
}

export const VERIFICATION_REQUESTS_REPO_TOKEN = Symbol(
    'verification-requests.repository',
);
