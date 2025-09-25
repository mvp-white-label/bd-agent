import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'

export async function POST() {
  try {
    // Create users table if it doesn't exist
    const { error: createTableError } = await supabaseAdmin.rpc('exec_sql', {
      sql: `
        CREATE TABLE IF NOT EXISTS users (
          id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
          microsoft_id VARCHAR(255) UNIQUE NOT NULL,
          email VARCHAR(255) NOT NULL,
          name VARCHAR(255) NOT NULL,
          is_approved BOOLEAN DEFAULT FALSE NOT NULL,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
          updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
        );
      `
    })

    if (createTableError) {
      console.error('Error creating table:', createTableError)
      return NextResponse.json({ 
        success: false, 
        error: 'Failed to create users table',
        details: createTableError.message
      })
    }

    // Create indexes
    await supabaseAdmin.rpc('exec_sql', {
      sql: `
        CREATE INDEX IF NOT EXISTS idx_users_microsoft_id ON users(microsoft_id);
        CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
        CREATE INDEX IF NOT EXISTS idx_users_is_approved ON users(is_approved);
      `
    })

    // Enable RLS
    await supabaseAdmin.rpc('exec_sql', {
      sql: 'ALTER TABLE users ENABLE ROW LEVEL SECURITY;'
    })

    // Create policies
    await supabaseAdmin.rpc('exec_sql', {
      sql: `
        DROP POLICY IF EXISTS "Service role can access all users" ON users;
        CREATE POLICY "Service role can access all users" ON users
          FOR ALL USING (auth.role() = 'service_role');
      `
    })

    return NextResponse.json({ 
      success: true, 
      message: 'Database setup completed successfully' 
    })
  } catch (error) {
    console.error('Setup error:', error)
    return NextResponse.json({ 
      success: false, 
      error: 'Failed to setup database',
      details: error instanceof Error ? error.message : 'Unknown error'
    })
  }
}

