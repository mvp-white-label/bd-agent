import { NextRequest, NextResponse } from 'next/server'
import { PublicClientApplication } from '@azure/msal-browser'
import { msalConfig } from '@/lib/msal-config'
import { supabaseAdmin } from '@/lib/supabase'
import { generateToken } from '@/lib/auth'

// Handle GET requests from Microsoft redirect
export async function GET(request: NextRequest) {
  try {
    const url = new URL(request.url)
    const code = url.searchParams.get('code')
    const error = url.searchParams.get('error')
    const state = url.searchParams.get('state')
    
    console.log('Callback received:', { code: !!code, error, state: !!state })
    
    if (error) {
      console.error('Microsoft auth error:', error)
      return NextResponse.redirect(new URL('/login?error=auth_failed', request.url))
    }
    
    if (!code) {
      console.error('No authorization code received')
      return NextResponse.redirect(new URL('/login?error=no_code', request.url))
    }

    // For now, let's redirect to a client-side handler that can use MSAL
    // This avoids the complex server-side token exchange
    const redirectUrl = new URL('/auth-redirect', request.url)
    redirectUrl.searchParams.set('code', code)
    if (state) redirectUrl.searchParams.set('state', state)
    
    return NextResponse.redirect(redirectUrl)

  } catch (error) {
    console.error('Authentication error:', error)
    return NextResponse.redirect(new URL('/login?error=server_error', request.url))
  }
}

export async function POST(request: NextRequest) {
  try {
    const { accessToken } = await request.json()

    if (!accessToken) {
      return NextResponse.json({ error: 'No access token provided' }, { status: 400 })
    }

    // Get user info from Microsoft Graph
    const userInfoResponse = await fetch('https://graph.microsoft.com/v1.0/me', {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    })

    if (!userInfoResponse.ok) {
      return NextResponse.json({ error: 'Failed to get user info from Microsoft' }, { status: 400 })
    }

    const userInfo = await userInfoResponse.json()
    const { id: microsoftId, mail: email, displayName: name } = userInfo

    if (!microsoftId || !email || !name) {
      return NextResponse.json({ error: 'Invalid user data from Microsoft' }, { status: 400 })
    }

    // Check if user exists in database
    const { data: existingUser } = await supabaseAdmin
      .from('users')
      .select('*')
      .eq('microsoft_id', microsoftId)
      .single()

    let user
    if (existingUser) {
      // User exists - update last login but preserve approval status
      const { data: updatedUser, error: updateError } = await supabaseAdmin
        .from('users')
        .update({
          email,
          name,
          updated_at: new Date().toISOString()
        })
        .eq('microsoft_id', microsoftId)
        .select()
        .single()

      if (updateError) {
        console.error('Error updating user:', updateError)
        return NextResponse.json({ error: 'Failed to update user' }, { status: 500 })
      }

      user = updatedUser
    } else {
      // Create new user (is_approved defaults to false)
      const { data: newUser, error: createError } = await supabaseAdmin
        .from('users')
        .insert({
          microsoft_id: microsoftId,
          email,
          name,
          is_approved: false
        })
        .select()
        .single()

      if (createError) {
        console.error('Error creating user:', createError)
        return NextResponse.json({ error: 'Failed to create user' }, { status: 500 })
      }

      user = newUser
    }

    // Generate JWT token
    const token = await generateToken({
      userId: user.id,
      email: user.email,
      name: user.name,
      isApproved: user.is_approved
    })

    console.log('Generated token for user:', { userId: user.id, isApproved: user.is_approved })

    // Set secure HTTP-only cookie
    const response = NextResponse.json({
      success: true,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        isApproved: user.is_approved
      }
    })

    response.cookies.set('auth-token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 // 7 days
    })

    return response

  } catch (error) {
    console.error('Authentication error:', error)
    return NextResponse.json({ error: 'Authentication failed' }, { status: 500 })
  }
}
