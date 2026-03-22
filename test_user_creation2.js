import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://osfsphdlpbijrlswfhfc.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9zZnNwaGRscGJpanJsc3dmaGZjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQwODkzNDIsImV4cCI6MjA4OTY2NTM0Mn0.wP65QbY7SChWbAdEH01jhWjRQ_qQ3Mdg2j7CujtAbuk';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function test() {
  console.log("Testing user creation logic without last_reset...");
  
  const mockUserId = '123e4567-e89b-12d3-a456-426614174002';
  const mockEmail = 'test_new_user2@example.com';
  
  const { data: newData, error: insertError } = await supabase
    .from('users1')
    .insert([
      {
        user_id: mockUserId,
        email: mockEmail,
        plan: 'free',
        credits_used: 0
      }
    ])
    .select()
    .single();
    
  console.log("Insert Error:", insertError);
  console.log("New Data:", newData);
}

test();
