import { Injectable, OnModuleInit } from '@nestjs/common';
import { JwtService as NestJwt } from '@nestjs/jwt';
import { CreateJwtDto } from 'src/application/dtos/auth/create-jwt.dto';
import { JwtConfig } from 'src/config/jwt.config';
import { JWTPayload } from 'src/domain/entities/auth/jwt-payload.entity';
import { JwtService } from 'src/domain/services/jwt.service';

@Injectable()
export class NestJwtService implements JwtService, OnModuleInit {
    service: NestJwt;
    constructor(private readonly jwtConfig: JwtConfig) {}

    onModuleInit() {
        this.service = new NestJwt({
            secret: this.jwtConfig.jwtSecret,
            signOptions: {
                expiresIn: '2h',
            },
        });
    }

    sign(payload: CreateJwtDto): string {
        return this.service.sign(payload);
    }

    verify(token: string): JWTPayload | null {
        return this.service.verify<JWTPayload>(token);
    }
}
