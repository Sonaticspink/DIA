import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://xzppffquaanmaddprhov.supabase.co';
const supabaseAnonKey = 'sb_publishable_7ziD8UiwU4VLGl5DI8hiWg_gQiYbvmU';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);