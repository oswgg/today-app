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
            useClass: PrismaUserRepository,
        },
        GetUser,
    ],
    controllers: [UserController],
})
export class UserModule {}
