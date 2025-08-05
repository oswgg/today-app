import { Global, Module } from '@nestjs/common';
import { ConfigModule as NestConfigModule } from '@nestjs/config';
import { SupabaseConfig } from './supabase.config';
import { JwtConfig } from './jwt.config';

@Global()
@Module({
    imports: [
        NestConfigModule.forRoot({
            isGlobal: true,
            envFilePath: ['.env', '.env.development'],
        }),
    ],
    providers: [SupabaseConfig, JwtConfig],
    exports: [SupabaseConfig, JwtConfig],
})
export class ConfigModule {}
