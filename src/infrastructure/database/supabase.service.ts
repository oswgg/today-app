import { Injectable, OnModuleInit } from '@nestjs/common';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { SupabaseConfig } from '../../config/supabase.config';

@Injectable()
export class SupabaseService implements OnModuleInit {
    supabase: SupabaseClient;
    adminClient: SupabaseClient;

    constructor(private readonly supabaseConfig: SupabaseConfig) {}

    onModuleInit() {
        // Cliente normal (anon key)
        this.supabase = createClient(
            this.supabaseConfig.supabaseUrl,
            this.supabaseConfig.supabaseKey,
        );

        // Cliente admin (service role key) para operaciones privilegiadas
        this.adminClient = createClient(
            this.supabaseConfig.supabaseUrl,
            this.supabaseConfig.supabaseServiceRoleKey,
            {
                auth: {
                    autoRefreshToken: false,
                    persistSession: false,
                },
            },
        );
    }
}
