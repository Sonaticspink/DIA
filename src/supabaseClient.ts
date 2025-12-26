import { createClient } from '@supabase/supabase-js';

// Get these from Project Settings > API in Supabase dashboard
const supabaseUrl = 'https://xzppffquaanmaddprhov.supabase.co';
const supabaseKey = 'sb_publishable_7ziD8UiwU4VLGl5DI8hiWg_gQiYbvmU';

export const supabase = createClient(supabaseUrl, supabaseKey);