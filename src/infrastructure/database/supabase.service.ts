import { Injectable, OnModuleInit } from '@nestjs/common';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { SupabaseConfig } from '../../config/supabase.config';

@Injectable()
export class SupabaseService implements OnModuleInit {
    supabase: SupabaseClient;

    constructor(private readonly supabaseConfig: SupabaseConfig) {}

    onModuleInit() {
        this.supabase = createClient(
            this.supabaseConfig.supabaseUrl,
            this.supabaseConfig.supabaseKey,
        );
    }
}
