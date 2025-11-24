import { IsNotEmpty, IsString } from 'class-validator';

export class MfaChallengeDto {
    @IsNotEmpty()
    @IsString()
    factorId: string;
}
