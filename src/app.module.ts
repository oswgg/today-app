import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './modules/auth/auth.module';
import { UserModule } from './modules/user/user.module';
import { ConfigModule } from './config/config.module';
import { EventsModule } from './modules/events/events.module';

@Module({
    imports: [ConfigModule, AuthModule, UserModule, EventsModule],
    controllers: [AppController],
    providers: [AppService],
})
export class AppModule {}
