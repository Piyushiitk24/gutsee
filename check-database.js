const { createClient } = require('@supabase/supabase-js')

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing Supabase environment variables')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseKey)

async function checkDatabase() {
  try {
    console.log('Checking database connection...')
    
    // Test basic connection
    const { data: testData, error: testError } = await supabase
      .from('users')
      .select('count')
      .limit(1)
    
    if (testError) {
      console.error('Database connection error:', testError)
      return
    }
    
    console.log('✅ Database connection successful')
    
    // Check if health_entries table exists
    const { data: entriesData, error: entriesError } = await supabase
      .from('health_entries')
      .select('count')
      .limit(1)
    
    if (entriesError) {
      console.error('❌ health_entries table missing:', entriesError)
      console.log('You need to run the health_entries_migration.sql')
      return
    }
    
    console.log('✅ health_entries table exists')
    
    // Check Supabase environment variables
    console.log('Environment variables:')
    console.log('- NEXT_PUBLIC_SUPABASE_URL:', process.env.NEXT_PUBLIC_SUPABASE_URL)
    console.log('- NEXT_PUBLIC_SUPABASE_ANON_KEY:', process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? 'Set' : 'Missing')
    console.log('- GOOGLE_AI_API_KEY:', process.env.GOOGLE_AI_API_KEY ? 'Set' : 'Missing')
    
  } catch (error) {
    console.error('Error checking database:', error)
  }
}

checkDatabase()
