import { Module } from '@nestjs/common';
import { GetUser } from 'src/application/use-cases/auth/get-user.usecase';
import { USER_REPO_TOKEN } from 'src/domain/repositories/user.repository';
import { PrismaService } from 'src/infrastructure/database/prisma/prisma.service';
import { PrismaUserRepository } from 'src/infrastructure/database/prisma/prisma.user.repo.impl';
import { UserController } from './user.controller';
import { UserInterestCategoriesModule } from './interests/categories/user-interest-categories.module';
import { UserInterestLocationsModule } from './interests/locations/user-interest-locations.module';
import { UserInterestOrganizersModule } from './interests/organizers/user-interest-organizers.module';
import { UserInterestEventsModule } from './interests/events/user-interest-events.module';
import { VERIFICATION_REQUESTS_REPO_TOKEN } from 'src/domain/repositories/verification-requests.repo';
import { PrismaVerificationRequestRespositoryImpl } from 'src/infrastructure/database/prisma/prisma.verification-requests.repo.impl';
import { CreateVerificationRequest } from 'src/application/use-cases/auth/verification-requests/create-verification-request.usecase';
import { FILE_SERVICE_TOKEN } from 'src/domain/services/files.service';
import { PureFileService } from 'src/infrastructure/services/pure.service.impl';
import { SQZUserRepoImpl } from 'src/infrastructure/repositories/sqz.user.repo.impl';

@Module({
    imports: [
        UserInterestCategoriesModule,
        UserInterestLocationsModule,
        UserInterestOrganizersModule,
        UserInterestEventsModule,
    ],
    providers: [
        PrismaService,
        {
            provide: USER_REPO_TOKEN,
            useClass: SQZUserRepoImpl,
        },
        {
            provide: VERIFICATION_REQUESTS_REPO_TOKEN,
            useClass: PrismaVerificationRequestRespositoryImpl,
        },
        {
            provide: FILE_SERVICE_TOKEN,
            useClass: PureFileService,
        },
        GetUser,
        CreateVerificationRequest,
    ],
    controllers: [UserController],
})
export class UserModule {}
