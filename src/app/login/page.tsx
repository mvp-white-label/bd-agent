'use client'

import { useState, useEffect } from 'react'
import { useMsal } from '@azure/msal-react'
import { useSearchParams } from 'next/navigation'
import { loginRequest, redirectRequest } from '@/lib/msal-config'

export default function LoginPage() {
  const { instance } = useMsal()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [approvalMessage, setApprovalMessage] = useState('')
  const searchParams = useSearchParams()

  useEffect(() => {
    const errorParam = searchParams.get('error')
    const statusParam = searchParams.get('status')
    
    if (errorParam) {
      switch (errorParam) {
        case 'auth_failed':
          setError('Authentication failed. Please try again.')
          break
        case 'no_token':
          setError('No authentication token received. Please try again.')
          break
        case 'redirect_failed':
          setError('Redirect failed. Please try again.')
          break
        default:
          setError('An error occurred during authentication.')
      }
    }
    
    if (statusParam === 'not_approved') {
      setApprovalMessage('Your account is not yet approved. Please contact an administrator.')
    }
  }, [searchParams])

  const handleLogin = async () => {
    try {
      setIsLoading(true)
      setError('') // Clear any previous errors
      setApprovalMessage('') // Clear any previous approval messages
      
      // Use popup login flow
      const response = await instance.loginPopup(loginRequest)
      
      if (response && response.accessToken) {
        console.log('Got access token from popup')
        
        // Send the access token to our backend
        const backendResponse = await fetch('/api/auth/callback', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            accessToken: response.accessToken,
          }),
        })

        if (backendResponse.ok) {
          const data = await backendResponse.json()
          console.log('Backend response:', data)
          console.log('User isApproved:', data.user.isApproved)
          
          // Force redirect after a short delay to ensure popup is closed
          setTimeout(() => {
            if (data.user.isApproved) {
              console.log('Redirecting to welcome page')
              window.location.href = '/welcome'
            } else {
              console.log('User not approved, staying on login page with message')
              setApprovalMessage('Your account is not yet approved. Please contact an administrator.')
              setError('') // Clear any previous errors
            }
          }, 100)
        } else {
          const errorText = await backendResponse.text()
          console.error('Backend authentication failed:', errorText)
          setError('Authentication failed. Please try again.')
        }
      } else {
        console.error('No access token received from popup')
        setError('No access token received. Please try again.')
      }
    } catch (error) {
      console.error('Login error:', error)
      setError('Login failed. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Sign in to your account
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Use your Microsoft 365 account to access the application
          </p>
          {error && (
            <div className="mt-4 bg-red-50 border border-red-200 rounded-md p-4">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-sm text-red-800">{error}</p>
                </div>
              </div>
            </div>
          )}
          
          {approvalMessage && (
            <div className="mt-4 bg-yellow-50 border border-yellow-200 rounded-md p-4">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-sm text-yellow-800">{approvalMessage}</p>
                </div>
              </div>
            </div>
          )}
        </div>
        
        <div className="mt-8 space-y-6">
          <div>
            <button
              onClick={handleLogin}
              disabled={isLoading}
              className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <div className="flex items-center">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Signing in...
                </div>
              ) : (
                <div className="flex items-center">
                  <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                    <path fill="currentColor" d="M11.4 24H0V12.6h11.4V24zM24 24H12.6V12.6H24V24zM11.4 11.4H0V0h11.4v11.4zM24 11.4H12.6V0H24v11.4z"/>
                  </svg>
                  Sign in with Microsoft
                </div>
              )}
            </button>
          </div>
          
          <div className="text-center">
            <p className="text-xs text-gray-500">
              By signing in, you agree to our terms of service and privacy policy.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
