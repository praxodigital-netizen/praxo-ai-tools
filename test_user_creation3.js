import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://osfsphdlpbijrlswfhfc.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9zZnNwaGRscGJpanJsc3dmaGZjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQwODkzNDIsImV4cCI6MjA4OTY2NTM0Mn0.wP65QbY7SChWbAdEH01jhWjRQ_qQ3Mdg2j7CujtAbuk';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function test() {
  console.log("Testing user creation logic with auth...");
  
  // We can't easily mock auth in a simple script without credentials, 
  // but we can check the RLS policies if we had access.
  // Let's just check what columns exist in users1
  
  const { data, error } = await supabase
    .from('users1')
    .select('*')
    .limit(1);
    
  console.log("Data:", data);
  console.log("Error:", error);
}

test();
