import { Inject, Injectable } from '@nestjs/common';
import {
    AUTH_SERVICE_TOKEN,
    AuthService,
} from 'src/domain/services/auth.service';

@Injectable()
export class GetGoogleOAuthURL {
    constructor(
        @Inject(AUTH_SERVICE_TOKEN) private readonly authService: AuthService,
    ) {}

    async execute(): Promise<string> {
        return await this.authService.getGoogleOAuthURL();
    }
}
