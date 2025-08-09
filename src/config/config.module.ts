import { Global, Module } from '@nestjs/common';
import { ConfigModule as NestConfigModule } from '@nestjs/config';
import { SupabaseConfig } from './supabase.config';
import { JwtConfig } from './jwt.config';
import { I18nModule, QueryResolver } from 'nestjs-i18n';
import { join } from 'path';

@Global()
@Module({
    imports: [
        NestConfigModule.forRoot({
            isGlobal: true,
            envFilePath: ['.env', '.env.development'],
        }),
        I18nModule.forRoot({
            fallbackLanguage: 'es',
            loaderOptions: {
                path: join(__dirname, '..', 'i18n'),
                watch: false,
            },
            resolvers: [new QueryResolver(['lang'])],
            typesOutputPath: join(
                process.cwd(),
                'src',
                'i18n',
                'generated',
                'i18n.generated.ts',
            ),
        }),
    ],
    providers: [SupabaseConfig, JwtConfig],
    exports: [SupabaseConfig, JwtConfig],
})
export class ConfigModule {}
