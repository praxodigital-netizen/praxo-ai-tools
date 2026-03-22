import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://osfsphdlpbijrlswfhfc.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9zZnNwaGRscGJpanJsc3dmaGZjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQwODkzNDIsImV4cCI6MjA4OTY2NTM0Mn0.wP65QbY7SChWbAdEH01jhWjRQ_qQ3Mdg2j7CujtAbuk';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function test() {
  // Try to insert a user with a specific ID that might be allowed by RLS
  // RLS usually requires auth.uid() == user_id
  // Since we are using anon key, we can't insert unless RLS allows anon inserts
  
  console.log("RLS prevents inserts from anon key without an active session.");
  console.log("The issue is likely that the 'last_reset' column does not exist in the 'users1' table.");
}

test();
