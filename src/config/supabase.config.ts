import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class SupabaseConfig {
    constructor(private configService: ConfigService) {}

    get supabaseUrl(): string {
        const url = this.configService.get<string>('SUPABASE_AUTH_URL');
        if (!url) {
            throw new Error(
                'SUPABASE_AUTH_URL environment variable is required',
            );
        }
        return url;
    }

    get supabaseKey(): string {
        const key = this.configService.get<string>('SUPABASE_API_KEY');
        if (!key) {
            throw new Error(
                'SUPABASE_API_KEY environment variable is required',
            );
        }
        return key;
    }
}
