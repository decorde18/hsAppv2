import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://gppzzqntjnmtbmrgigvw.supabase.co';
const supabaseKey =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdwcHp6cW50am5tdGJtcmdpZ3Z3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE2ODgxMzQ3MTQsImV4cCI6MjAwMzcxMDcxNH0.vu9ED2EB39nSa7K89GaPTF6sYpIbx2rY4t-LNxbvINU';
const supabase = createClient(supabaseUrl, supabaseKey);

export default supabase;
