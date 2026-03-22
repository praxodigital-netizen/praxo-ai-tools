import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://osfsphdlpbijrlswfhfc.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9zZnNwaGRscGJpanJsc3dmaGZjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQwODkzNDIsImV4cCI6MjA4OTY2NTM0Mn0.wP65QbY7SChWbAdEH01jhWjRQ_qQ3Mdg2j7CujtAbuk';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function test() {
  console.log("Testing user creation logic with actual auth...");
  
  // Create a dummy user
  const { data: authData, error: authError } = await supabase.auth.signUp({
    email: 'test_user_' + Date.now() + '@example.com',
    password: 'password123'
  });
  
  console.log("Auth Error:", authError);
  
  if (authData.user) {
    console.log("Auth User ID:", authData.user.id);
    
    // Now try to insert with the authenticated user's ID
    const { data: newData, error: insertError } = await supabase
      .from('users1')
      .insert([
        {
          user_id: authData.user.id,
          email: authData.user.email,
          plan: 'free',
          credits_used: 0
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
  }
}

test();
