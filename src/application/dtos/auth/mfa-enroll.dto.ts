import { IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export enum MfaFactorType {
    TOTP = 'totp',
}

export class MfaEnrollDto {
    @IsNotEmpty()
    @IsEnum(MfaFactorType)
    factorType: MfaFactorType;

    @IsOptional()
    @IsString()
    friendlyName?: string;
}
