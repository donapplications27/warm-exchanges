
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = '[Your Supabase Public URL]';
const supabaseAnonKey = '[Your Supabase Public/Anon Key]';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

export default supabase;
