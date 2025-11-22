import {
    Body,
    Controller,
    Post,
    UploadedFiles,
    UseInterceptors,
} from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { GetUser } from 'src/application/use-cases/auth/get-user.usecase';
import { I18nService } from 'nestjs-i18n';
import { I18nTranslations } from 'src/i18n/generated/i18n.generated';
import { CreateVerificationRequest } from 'src/application/use-cases/auth/verification-requests/create-verification-request.usecase';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { JwtUserPayload } from 'src/domain/entities/auth/jwt-payload.entity';
import { User } from '../shared/decorators/user.decorator';
import { ZodValidator } from 'src/infrastructure/http/validator/zod/zod.validator';
import { ZodCreateVerificationRequestSchema } from 'src/infrastructure/http/validator/zod/auth/zod.create-verification-request.schema';
import { CreateVerificationRequestDto } from 'src/application/dtos/auth/verification-requests/create-verification.dto';
import { ValidationPipe } from '../shared/pipes/validation.pipe';
import { MulterConfigFactory } from 'src/config/multer.config';

@ApiTags('user')
@ApiBearerAuth('JWT-auth')
@Controller('user')
export class UserController {
    constructor(
        private readonly getUser: GetUser,
        private readonly translator: I18nService<I18nTranslations>,
        private readonly createVerificationRequest: CreateVerificationRequest,
    ) {}

    @Post('verification-request')
    @UseInterceptors(
        FileFieldsInterceptor(
            [
                {
                    name: 'document_id',
                    maxCount: 1,
                },
            ],
            MulterConfigFactory.basic,
        ),
    )
    async VerificationRequest(
        @User() user: JwtUserPayload,
        @Body(
            new ValidationPipe(
                new ZodValidator(ZodCreateVerificationRequestSchema),
            ),
        )
        body: Omit<CreateVerificationRequestDto, 'documents' | 'userId'>,
        @UploadedFiles() files: { document_id?: Express.Multer.File[] },
    ) {
        const result = await this.createVerificationRequest.execute({
            userId: user.id,
            ...body,
            documents: [],
            uploadedFiles: files.document_id || [],
        });

        // Exclude documents from response
        const { documents, user: userRelation, ...response } = result;
        return response;
    }
}
