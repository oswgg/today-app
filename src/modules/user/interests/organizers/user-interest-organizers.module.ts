import { Module } from '@nestjs/common';
import { UserInterestOrganizersController } from './user-interest-organizers.controller';
import { AddInterestOrganizers } from 'src/application/use-cases/user/interests/organizers/add-interest-organizers.usecase';
import { RemoveInterestOrganizers } from 'src/application/use-cases/user/interests/organizers/remove-interest-organizers.usecase';
import { ListUserInterestOrganizers } from 'src/application/use-cases/user/interests/organizers/list-user-interest-organizers.usecase';
import { IsUserInterestedInOrganizer } from 'src/application/use-cases/user/interests/organizers/is-user-interested-organizer.usecase';
import { USER_INTEREST_ORGANIZER_REPO_TOKEN } from 'src/domain/repositories/user-interest-organizer.repository';
import { PrismaUserInterestOrganizerRepositoryImpl } from 'src/infrastructure/database/prisma/prisma.user-interest-organizer.repository.impl';
import { PrismaService } from 'src/infrastructure/database/prisma/prisma.service';
import { USER_REPO_TOKEN } from 'src/domain/repositories/user.repository';

@Module({
    controllers: [UserInterestOrganizersController],
    providers: [
        PrismaService,
        {
            provide: USER_INTEREST_ORGANIZER_REPO_TOKEN,
            useClass: PrismaUserInterestOrganizerRepositoryImpl,
        },
        {
            provide: USER_REPO_TOKEN,
            useClass: PrismaUserInterestOrganizerRepositoryImpl,
        },
        AddInterestOrganizers,
        RemoveInterestOrganizers,
        ListUserInterestOrganizers,
        IsUserInterestedInOrganizer,
    ],
})
export class UserInterestOrganizersModule {}
