import { Module } from '@nestjs/common';
import { UserInterestLocationsController } from './user-interest-locations.controller';
import { AddInterestLocations } from 'src/application/use-cases/user/interests/locations/add-interest-locations.usecase';
import { RemoveInterestLocations } from 'src/application/use-cases/user/interests/locations/remove-interest-locations.usecase';
import { ListUserInterestLocations } from 'src/application/use-cases/user/interests/locations/list-user-interest-locations.usecase';
import { IsUserInterestedInLocation } from 'src/application/use-cases/user/interests/locations/is-user-interested-location.usecase';
import { USER_INTEREST_LOCATION_REPO_TOKEN } from 'src/domain/repositories/user-interest-location.repository';
import { PrismaUserInterestLocationRepositoryImpl } from 'src/infrastructure/database/prisma/prisma.user-interest-location.repository.impl';
import { PrismaService } from 'src/infrastructure/database/prisma/prisma.service';

@Module({
    controllers: [UserInterestLocationsController],
    providers: [
        PrismaService,
        {
            provide: USER_INTEREST_LOCATION_REPO_TOKEN,
            useClass: PrismaUserInterestLocationRepositoryImpl,
        },
        AddInterestLocations,
        RemoveInterestLocations,
        ListUserInterestLocations,
        IsUserInterestedInLocation,
    ],
})
export class UserInterestLocationsModule {}
