import { ApiProperty } from '@nestjs/swagger';
import { UserRole } from 'src/domain/types/user-role.enum';

export class RegisterWithOAuthDto {
    @ApiProperty({
        description: 'OAuth token from provider',
        example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
    })
    token: string;

    @ApiProperty({
        description: 'User type to register',
        enum: UserRole,
        example: UserRole.USER,
    })
    user_type: UserRole;
}
