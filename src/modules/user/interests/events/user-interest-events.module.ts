import { Module } from '@nestjs/common';
import { UserInterestEventsController } from './user-interest-events.controller';
import { AddInterestEvents } from 'src/application/use-cases/user/interests/events/add-interest-events.usecase';
import { RemoveInterestEvents } from 'src/application/use-cases/user/interests/events/remove-interest-events.usecase';
import { ListUserInterestEvents } from 'src/application/use-cases/user/interests/events/list-user-interest-events.usecase';
import { IsUserInterestedInEvent } from 'src/application/use-cases/user/interests/events/is-user-interested-event.usecase';
import { USER_INTEREST_EVENT_REPO_TOKEN } from 'src/domain/repositories/user-interest-event.repository';
import { PrismaUserInterestEventRepositoryImpl } from 'src/infrastructure/database/prisma/prisma.user-interest-event.repository.impl';
import { PrismaService } from 'src/infrastructure/database/prisma/prisma.service';

@Module({
    controllers: [UserInterestEventsController],
    providers: [
        PrismaService,
        {
            provide: USER_INTEREST_EVENT_REPO_TOKEN,
            useClass: PrismaUserInterestEventRepositoryImpl,
        },
        AddInterestEvents,
        RemoveInterestEvents,
        ListUserInterestEvents,
        IsUserInterestedInEvent,
    ],
})
export class UserInterestEventsModule {}
