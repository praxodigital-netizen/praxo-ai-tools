import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://osfsphdlpbijrlswfhfc.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9zZnNwaGRscGJpanJsc3dmaGZjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQwODkzNDIsImV4cCI6MjA4OTY2NTM0Mn0.wP65QbY7SChWbAdEH01jhWjRQ_qQ3Mdg2j7CujtAbuk';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function test() {
  console.log("Testing user creation logic...");
  
  // 1. Create a mock user ID (UUID format)
  const mockUserId = '123e4567-e89b-12d3-a456-426614174001';
  const mockEmail = 'test_new_user@example.com';
  
  console.log(`Mock User ID: ${mockUserId}`);
  
  // 2. Check if user exists
  const { data: existingUser, error: selectError } = await supabase
    .from('users1')
    .select('*')
    .eq('user_id', mockUserId)
    .maybeSingle();
    
  console.log("Select Error:", selectError);
  console.log("Existing User:", existingUser);
  
  if (!existingUser) {
    console.log("User does not exist. Attempting to insert...");
    
    const now = new Date().toISOString();
    const { data: newData, error: insertError } = await supabase
      .from('users1')
      .insert([
        {
          user_id: mockUserId,
          email: mockEmail,
          plan: 'free',
          credits_used: 0,
          last_reset: now
        }
      ])
      .select()
      .single();
      
    console.log("Insert Error:", insertError);
    console.log("New Data:", newData);
    
    if (insertError) {
      console.error("FAILED to insert user:", insertError.message);
    } else {
      console.log("SUCCESS! User created.");
    }
  } else {
    console.log("User already exists.");
  }
}

test();
