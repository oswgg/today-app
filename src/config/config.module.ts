import { Global, Module } from '@nestjs/common';
import { ConfigModule as NestConfigModule } from '@nestjs/config';
import { SupabaseConfig } from './supabase.config';

@Global()
@Module({
    imports: [
        NestConfigModule.forRoot({
            isGlobal: true,
            envFilePath: ['.env'],
        }),
    ],
    providers: [SupabaseConfig],
    exports: [SupabaseConfig],
})
export class ConfigModule {}
