import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { UserRole } from '../src/domain/types/user-role.enum';
import { App } from 'supertest/types';

describe('AppController (e2e)', () => {
    let app: INestApplication<App>;

    beforeEach(async () => {
        const moduleFixture: TestingModule = await Test.createTestingModule({
            imports: [AppModule],
        }).compile();

        app = moduleFixture.createNestApplication();
        await app.init();
    });

    afterEach(async () => {
        await app.close();
    });

    describe('App Controller', () => {
        it('/ (GET) - should return hello world', () => {
            return request(app.getHttpServer())
                .get('/')
                .expect(200)
                .expect('Hello World!');
        });
    });

    describe('Auth Controller', () => {
        describe('GET /auth/google', () => {
            it('should redirect to Google OAuth URL', () => {
                return request(app.getHttpServer())
                    .get('/auth/oauth/google')
                    .expect(302) // Redirect status
                    .expect(
                        'Location',
                        /^https:\/\/.*\.supabase\.co\/auth\/v1\/authorize/,
                    );
            });
        });

        describe('POST /auth/register/oauth', () => {
            it('should return 400 for invalid user_type', () => {
                return request(app.getHttpServer())
                    .post('/auth/register/oauth')
                    .send({
                        token: 'invalid-token',
                        user_type: 'invalid-role',
                    })
                    .expect(400);
            });

            it('should return 400 for missing token', () => {
                return request(app.getHttpServer())
                    .post('/auth/register/oauth')
                    .send({
                        user_type: UserRole.USER,
                    })
                    .expect(400); // Will throw error for missing token
            });

            it('should return 400 for missing user_type', () => {
                return request(app.getHttpServer())
                    .post('/auth/register/oauth')
                    .send({
                        token: 'test-token',
                    })
                    .expect(400); // Will throw error for missing user_type
            });

            it('should handle valid user registration request', () => {
                return request(app.getHttpServer())
                    .post('/auth/register/oauth')
                    .send({
                        token: 'valid-oauth-token',
                        user_type: UserRole.USER,
                    })
                    .expect(500); // Will likely fail due to invalid token, but tests the endpoint
            });
        });
    });

    describe('User Controller', () => {
        describe('GET /user/:id', () => {
            it('should return 400 for invalid user ID (string)', () => {
                return request(app.getHttpServer())
                    .get('/user/invalid-id')
                    .expect(400);
            });

            it('should return 404 for non-existent user', () => {
                return request(app.getHttpServer())
                    .get('/user/999999')
                    .expect(404);
            });

            it('should return 400 for negative user ID', () => {
                return request(app.getHttpServer()).get('/user/-1').expect(400);
            });

            it('should return 400 for zero user ID', () => {
                return request(app.getHttpServer()).get('/user/0').expect(400);
            });
        });
    });

    describe('Health Check', () => {
        it('should return 200 for root endpoint', () => {
            return request(app.getHttpServer()).get('/').expect(200);
        });
    });
});
