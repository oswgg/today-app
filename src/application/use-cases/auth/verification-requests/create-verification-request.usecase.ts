import { ForbiddenException, Inject, Injectable } from '@nestjs/common';
import { I18nService } from 'nestjs-i18n';
import { CreateVerificationRequestDto } from 'src/application/dtos/auth/verification-requests/create-verification.dto';
import { VerificationRequestEntity } from 'src/domain/entities/auth/verification-requests/verification-request.entity';
import {
    VERIFICATION_REQUESTS_REPO_TOKEN,
    VerificationRequestsRepository,
} from 'src/domain/repositories/verification-requests.repo';
import { I18nTranslations } from 'src/i18n/generated/i18n.generated';
import {
    FILE_SERVICE_TOKEN,
    FileService,
} from 'src/domain/services/files.service';
import { FileDestinations } from 'src/config/files.config';
import { VerificationRequestDocumentEntity } from 'src/domain/entities/auth/verification-requests/verification-request-document.entity';

@Injectable()
export class CreateVerificationRequest {
    constructor(
        @Inject(VERIFICATION_REQUESTS_REPO_TOKEN)
        private readonly verificationRequestsRepository: VerificationRequestsRepository,
        @Inject(FILE_SERVICE_TOKEN)
        private readonly fileService: FileService,
        private readonly translator: I18nService<I18nTranslations>,
    ) {}

    async execute(
        data: CreateVerificationRequestDto & {
            uploadedFiles?: Express.Multer.File[];
        },
    ): Promise<VerificationRequestEntity> {
        const existingRequest =
            await this.verificationRequestsRepository.findByUserId(data.userId);
        if (existingRequest) {
            throw new ForbiddenException(
                this.translator.t('users.errors.verification_request_exists'),
            );
        }

        const movedDocuments: string[] = [];

        try {
            // Process uploaded files and move them to private directory
            const documents: VerificationRequestDocumentEntity[] = [];

            if (data.uploadedFiles && data.uploadedFiles.length > 0) {
                for (const file of data.uploadedFiles) {
                    console.log(file);
                    const movedPath = await this.fileService.move(
                        file.path,
                        FileDestinations.privateVerificationDocuments,
                    );
                    movedDocuments.push(movedPath);

                    documents.push({
                        id: 0, // Will be set by database
                        requestId: 0, // Will be set by database
                        url: movedPath,
                        fileType: 'ID_DOCUMENT',
                        uploadedAt: new Date(),
                    });
                }
            }

            const verificationRequest =
                await this.verificationRequestsRepository.create({
                    ...data,
                    documents,
                });

            return verificationRequest;
        } catch (error) {
            // Clean up moved files on error
            for (const docPath of movedDocuments) {
                try {
                    await this.fileService.remove(docPath);
                } catch (cleanupError) {
                    // Log but don't throw cleanup errors
                    console.error(
                        'Failed to cleanup file:',
                        docPath,
                        cleanupError,
                    );
                }
            }

            // Clean up temp files if they still exist
            if (data.uploadedFiles) {
                for (const file of data.uploadedFiles) {
                    try {
                        await this.fileService.remove(file.path);
                    } catch (cleanupError) {
                        // Ignore if already moved/deleted
                    }
                }
            }

            throw error;
        }
    }
}
