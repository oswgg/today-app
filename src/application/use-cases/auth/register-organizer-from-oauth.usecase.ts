import { Inject } from '@nestjs/common';
import { OrganizerEntity } from 'src/domain/entities/organizer.entity';
import {
    USER_REPO_TOKEN,
    UserRepository,
} from 'src/domain/repositories/user.repository';
import {
    AUTH_SERVICE_TOKEN,
    AuthService,
} from 'src/domain/services/auth.service';

export class RegisterOrganizerFromOAuth {
    constructor(
        @Inject(AUTH_SERVICE_TOKEN)
        private readonly authService: AuthService,
        @Inject(USER_REPO_TOKEN)
        private readonly userRepository: UserRepository,
    ) {}

    async execute(token: string): Promise<OrganizerEntity> {
        const user = await this.authService.getUserFromOAuthToken(token);

        const existingUser = await this.userRepository.findByEmail(user.email);
        if (existingUser) {
            throw new Error('User already exists');
        }

        const organizer =
            await this.userRepository.registerOrganizerFromOAuth(user);

        return organizer;
    }
}
