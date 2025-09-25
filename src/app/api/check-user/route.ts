import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'

export async function GET() {
  try {
    // Get all users to see their approval status
    const { data: users, error } = await supabaseAdmin
      .from('users')
      .select('id, email, name, is_approved, created_at, microsoft_id')
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Error fetching users:', error)
      return NextResponse.json({ 
        success: false, 
        error: 'Failed to fetch users',
        details: error.message
      })
    }

    return NextResponse.json({ 
      success: true, 
      message: 'Users fetched successfully',
      users 
    })
  } catch (error) {
    console.error('Check user error:', error)
    return NextResponse.json({ 
      success: false, 
      error: 'Failed to check users' 
    })
  }
}

