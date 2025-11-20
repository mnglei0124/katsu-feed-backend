import { Injectable, OnModuleInit } from '@nestjs/common';
import { createClient, SupabaseClient } from '@supabase/supabase-js';

@Injectable()
export class SupabaseService implements OnModuleInit {
  public supabaseClient!: SupabaseClient;

  onModuleInit() {
    // TODO: Replace with your actual Supabase URL and Anon Key from environment variables
    const supabaseUrl = process.env.SUPABASE_URL || 'YOUR_SUPABASE_URL';
    const supabaseKey = process.env.SUPABASE_KEY || 'YOUR_SUPABASE_ANON_KEY';

    this.supabaseClient = createClient(supabaseUrl, supabaseKey);
  }
}
