import { IsNotEmpty, IsString } from 'class-validator';

export class MfaVerifyDto {
    @IsNotEmpty()
    @IsString()
    factorId: string;

    @IsNotEmpty()
    @IsString()
    code: string;
}
