
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://vglszhhommhffiqaxyfz.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZnbHN6aGhvbW1oZmZpcWF4eWZ6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDIzMjQwNDEsImV4cCI6MjA1NzkwMDA0MX0.Bsz7peQbQvaDLxwqtTv5r43O8IisOpeJl0jYCqxBDnw';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

export default supabase;
