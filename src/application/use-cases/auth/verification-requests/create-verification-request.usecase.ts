import { ForbiddenException, Inject, Injectable } from '@nestjs/common';
import { I18nService } from 'nestjs-i18n';
import { CreateVerificationRequestDto } from 'src/application/dtos/auth/verification-requests/create-verification.dto';
import { VerificationRequestEntity } from 'src/domain/entities/auth/verification-requests/verification-request.entity';
import {
    VERIFICATION_REQUESTS_REPO_TOKEN,
    VerificationRequestsRepository,
} from 'src/domain/repositories/verification-requests.repo';
import { I18nTranslations } from 'src/i18n/generated/i18n.generated';

@Injectable()
export class CreateVerificationRequest {
    constructor(
        @Inject(VERIFICATION_REQUESTS_REPO_TOKEN)
        private readonly verificationRequestsRepository: VerificationRequestsRepository,
        private readonly translator: I18nService<I18nTranslations>,
    ) {}

    async execute(
        data: CreateVerificationRequestDto,
    ): Promise<VerificationRequestEntity> {
        const existingRequest =
            await this.verificationRequestsRepository.findByUserId(data.userId);
        if (existingRequest) {
            throw new ForbiddenException(
                this.translator.t('users.errors.verification_request_exists'),
            );
        }

        return await this.verificationRequestsRepository.create(data);
    }
}
