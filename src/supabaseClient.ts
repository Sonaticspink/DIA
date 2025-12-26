import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://xzppffquaanmaddprhov.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inh6cHBmZnF1YWFubWFkZHByaG92Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjY0OTY2MjYsImV4cCI6MjA4MjA3MjYyNn0.epjZL7jzvs98LbTWkmhBvwgATOHgH2EfDs5l72wuLXU';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);