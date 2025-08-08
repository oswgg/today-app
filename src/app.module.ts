import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './modules/auth/auth.module';
import { UserModule } from './modules/user/user.module';
import { ConfigModule } from './config/config.module';
import { EventsModule } from './modules/events/events.module';
import { JWT_SERVICE_TOKEN } from './domain/services/jwt.service';
import { NestJwtService } from './infrastructure/services/nest.jwt.service.impl';
import { APP_GUARD } from '@nestjs/core';
import { AuthGuard } from './modules/shared/guards/auth.guard';
import { VenuesModule } from './modules/venues/venues.module';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';

@Module({
    providers: [
        {
            provide: APP_GUARD,
            useClass: AuthGuard,
        },
        {
            provide: JWT_SERVICE_TOKEN,
            useClass: NestJwtService,
        },
        AppService,
    ],
    imports: [
        ServeStaticModule.forRoot({
            rootPath: join(process.cwd(), 'public'),
            serveRoot: '/public/',
        }),
        ConfigModule,
        AuthModule,
        UserModule,
        EventsModule,
        VenuesModule,
    ],
    controllers: [AppController],
})
export class AppModule {}
