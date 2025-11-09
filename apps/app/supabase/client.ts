import { createClient, SupabaseClient, SupabaseClientOptions } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL as string;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY as string;

const options = {
    db: {
        schema: 'public',
    },
    auth: {
        autoRefreshToken: true,
        persistSession: true,
        detectSessionInUrl: true
    },
    global: {
        headers: { 'x-my-custom-header': 'storyflow-db' },
    },
}

export const supabase: SupabaseClient = createClient(supabaseUrl, supabaseKey, options as SupabaseClientOptions);