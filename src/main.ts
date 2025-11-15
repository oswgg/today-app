import 'dotenv/config';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
    (BigInt.prototype as unknown as { toJSON: () => string }).toJSON =
        function (this: bigint) {
            return this.toString();
        };
    const app = await NestFactory.create(AppModule, {
        cors: {
            origin: '*',
            methods: [
                'GET',
                'HEAD',
                'PUT',
                'PATCH',
                'POST',
                'DELETE',
                'OPTIONS',
            ],
        },
    });

    // Swagger Configuration
    const config = new DocumentBuilder()
        .setTitle('Today App API')
        .setDescription(
            'API documentation for Today App - Event and Venue Management',
        )
        .setVersion('1.0')
        .addTag('auth', 'Authentication endpoints')
        .addTag('events', 'Event management endpoints')
        .addTag('venues', 'Venue management endpoints')
        .addTag('user', 'User management endpoints')
        .addBearerAuth(
            {
                type: 'http',
                scheme: 'bearer',
                bearerFormat: 'JWT',
                name: 'JWT',
                description: 'Enter JWT token',
                in: 'header',
            },
            'JWT-auth',
        )
        .build();

    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('api/docs', app, document);

    // Endpoint to get OpenAPI JSON
    app.getHttpAdapter().get('/api/docs-json', (req, res) => {
        res.json(document);
    });

    await app.listen(process.env.PORT ?? 3000);
}

void bootstrap();
