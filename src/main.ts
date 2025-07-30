import 'dotenv/config';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
    (BigInt.prototype as unknown as { toJSON: () => string }).toJSON =
        function (this: bigint) {
            return this.toString();
        };
    const app = await NestFactory.create(AppModule);
    await app.listen(process.env.PORT ?? 3000);
}

void bootstrap();
