import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'

export async function GET() {
  try {
    // Test Supabase connection by trying to select from users table
    const { data, error } = await supabaseAdmin
      .from('users')
      .select('id')
      .limit(1)

    if (error) {
      console.error('Supabase error:', error)
      
      // If table doesn't exist, try to create it
      if (error.message.includes('relation "users" does not exist')) {
        return NextResponse.json({ 
          success: false, 
          error: 'Users table does not exist',
          details: 'Please run the SQL script in Supabase SQL Editor',
          sqlScript: `
CREATE TABLE users (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  microsoft_id VARCHAR(255) UNIQUE NOT NULL,
  email VARCHAR(255) NOT NULL,
  name VARCHAR(255) NOT NULL,
  is_approved BOOLEAN DEFAULT FALSE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_users_microsoft_id ON users(microsoft_id);
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_is_approved ON users(is_approved);

ALTER TABLE users ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Service role can access all users" ON users
  FOR ALL USING (auth.role() = 'service_role');
          `
        })
      }
      
      return NextResponse.json({ 
        success: false, 
        error: error.message,
        details: 'Supabase connection issue'
      })
    }

    return NextResponse.json({ 
      success: true, 
      message: 'Supabase connection working and users table exists',
      data 
    })
  } catch (error) {
    console.error('Test error:', error)
    return NextResponse.json({ 
      success: false, 
      error: 'Failed to connect to Supabase' 
    })
  }
}
