import { ApiProperty } from '@nestjs/swagger';

export class LoginWitOAuthDto {
    @ApiProperty({
        description: 'OAuth token from provider',
        example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
    })
    token: string;
}
