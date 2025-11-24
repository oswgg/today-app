import { Controller, Get, UseGuards } from '@nestjs/common';
import { User } from '../shared/decorators/user.decorator';
import { JwtUserPayload } from 'src/domain/entities/auth/jwt-payload.entity';
import { MFA } from '../shared/decorators/require-mfa.decorator';
import { SkipMFA } from '../shared/decorators/skip-mfa.decorator';

@Controller('admin')
@MFA()
export class AdminController {
    @Get('dashboard')
    getDashboard(@User() user: JwtUserPayload) {
        return {
            message: 'Welcome to the admin dashboard',
            user,
        };
    }

    @Get('users')
    getUsers() {
        return {
            message: 'List of all users',
            // TODO: Implement user list retrieval
        };
    }

    @Get('statistics')
    @SkipMFA()
    getStatistics() {
        return {
            message: 'System statistics',
            // TODO: Implement statistics retrieval
        };
    }
}
