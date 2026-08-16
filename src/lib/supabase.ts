import { createClient } from '@supabase/supabase-js';

const SUPABASE_PROJECT_ID = 'rmgabkykwzpaofeawhiw';
const SUPABASE_URL = `https://${SUPABASE_PROJECT_ID}.supabase.co`;
const SUPABASE_ANON_KEY =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJtZ2Fia3lrd3pwYW9mZWF3aGl3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODY4NDk5NTQsImV4cCI6MjEwMjQyNTk1NH0.-I6ICkOoR5ilVeuROnQUVvjUZdFHBOELHztRVXbYY9o';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
