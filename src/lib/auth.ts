import { SignJWT, jwtVerify } from 'jose'
import { NextRequest } from 'next/server'

const secretKey = process.env.JWT_SECRET
const encodedKey = new TextEncoder().encode(secretKey)

export interface JWTPayload {
  userId: string
  email: string
  name: string
  isApproved: boolean
  iat?: number
  exp?: number
}

export async function generateToken(payload: { userId: string; email: string; name: string; isApproved: boolean }) {
  return new SignJWT(payload)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('7d') // Token expires in 7 days
    .sign(encodedKey)
}

export async function verifyToken(token: string) {
  try {
    const { payload } = await jwtVerify(token, encodedKey, {
      algorithms: ['HS256'],
    })
    return payload as { userId: string; email: string; name: string; isApproved: boolean }
  } catch (error) {
    console.error('JWT verification failed:', error)
    return null
  }
}

export async function getUserFromToken(request: NextRequest) {
  const token = request.cookies.get('auth-token')?.value
  if (!token) {
    return null
  }
  return verifyToken(token)
}
