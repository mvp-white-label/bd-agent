'use client'

import { useEffect, useState } from 'react'
import { useMsal } from '@azure/msal-react'
import { useRouter } from 'next/navigation'

export default function AuthRedirectPage() {
  const { instance } = useMsal()
  const router = useRouter()
  const [isProcessing, setIsProcessing] = useState(true)

  useEffect(() => {
    const handleRedirect = async () => {
      try {
        console.log('Handling redirect response...')
        
        // Handle the redirect response using MSAL
        const response = await instance.handleRedirectPromise()
        
        console.log('Redirect response:', response)
        
        if (response && response.accessToken) {
          console.log('Got access token from MSAL redirect')
          
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
            // Redirect to dashboard or pending approval based on user status
            const data = await backendResponse.json()
            console.log('Backend response:', data)
            
            if (data.user.isApproved) {
              router.push('/dashboard')
            } else {
              router.push('/pending-approval')
            }
          } else {
            const errorText = await backendResponse.text()
            console.error('Backend authentication failed:', errorText)
            router.push('/login?error=auth_failed')
          }
        } else {
          console.log('No access token in redirect response, checking for cached tokens...')
          
          // Try to get token from cache
          const accounts = instance.getAllAccounts()
          if (accounts.length > 0) {
            try {
              const silentRequest = {
                scopes: ['User.Read'],
                account: accounts[0]
              }
              
              const silentResponse = await instance.acquireTokenSilent(silentRequest)
              
              if (silentResponse && silentResponse.accessToken) {
                console.log('Got access token from silent request')
                
                // Send the access token to our backend
                const backendResponse = await fetch('/api/auth/callback', {
                  method: 'POST',
                  headers: {
                    'Content-Type': 'application/json',
                  },
                  body: JSON.stringify({
                    accessToken: silentResponse.accessToken,
                  }),
                })

                if (backendResponse.ok) {
                  const data = await backendResponse.json()
                  console.log('Backend response:', data)
                  
                  if (data.user.isApproved) {
                    router.push('/dashboard')
                  } else {
                    router.push('/pending-approval')
                  }
                } else {
                  const errorText = await backendResponse.text()
                  console.error('Backend authentication failed:', errorText)
                  router.push('/login?error=auth_failed')
                }
              } else {
                console.error('No access token from silent request')
                router.push('/login?error=no_token')
              }
            } catch (silentError) {
              console.error('Silent token acquisition failed:', silentError)
              router.push('/login?error=silent_failed')
            }
          } else {
            console.error('No accounts found')
            router.push('/login?error=no_accounts')
          }
        }
      } catch (error) {
        console.error('Redirect handling error:', error)
        router.push('/login?error=redirect_failed')
      } finally {
        setIsProcessing(false)
      }
    }

    handleRedirect()
  }, [instance, router])

  if (isProcessing) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-lg text-gray-600">Processing authentication...</p>
        </div>
      </div>
    )
  }

  return null
}
