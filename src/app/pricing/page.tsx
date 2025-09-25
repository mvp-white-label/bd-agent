'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'

interface User {
  id: string
  email: string
  name: string
  isApproved: boolean
}

interface PricingPlan {
  id: string
  name: string
  price: string
  period: string
  features: string[]
  isPopular?: boolean
  category: 'manual' | 'auto'
  buttonText: string
  buttonVariant: 'primary' | 'secondary'
}

export default function PricingPage() {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null)
  const router = useRouter()

  const pricingPlans: PricingPlan[] = [
    {
      id: 'manual',
      name: 'Manual Response Tool',
      price: '$19',
      period: '/month',
      category: 'manual',
      features: [
        'Email & Telegram notifications',
        'AI-powered job validation',
        'Smart response suggestions',
        '1 search feed included',
        'Basic customer support',
        'Job matching algorithm'
      ],
      buttonText: 'Start 7-Day Trial',
      buttonVariant: 'primary'
    },
    {
      id: 'starter',
      name: 'Starter Auto-Responder',
      price: '$199',
      period: 'one-time',
      category: 'auto',
      features: [
        'Everything in Manual plan',
        '100 auto-responses included',
        'Priority support chat',
        'No expiration date',
        'Advanced job filtering',
        'Response analytics dashboard'
      ],
      buttonText: 'Get Started',
      buttonVariant: 'primary'
    },
    {
      id: 'professional',
      name: 'Professional Auto-Responder',
      price: '$399',
      period: 'one-time',
      category: 'auto',
      isPopular: true,
      features: [
        'Everything in Starter plan',
        '500 auto-responses included',
        '1-on-1 setup consultation',
        'Custom proposal templates',
        'Advanced analytics & reporting',
        'Priority email support'
      ],
      buttonText: 'Choose Professional',
      buttonVariant: 'primary'
    },
    {
      id: 'enterprise',
      name: 'Enterprise Auto-Responder',
      price: '$799',
      period: 'one-time',
      category: 'auto',
      features: [
        'Everything in Professional plan',
        '1500 auto-responses included',
        'Dedicated account manager',
        'Custom integration support',
        'Monthly strategy calls',
        'White-label options available'
      ],
      buttonText: 'Contact Sales',
      buttonVariant: 'secondary'
    }
  ]

  useEffect(() => {
    const checkUserStatus = async () => {
      try {
        const response = await fetch('/api/auth/me')
        if (response.ok) {
          const data = await response.json()
          setUser(data.user)
          
          // If user is not approved, redirect to login
          if (!data.user.isApproved) {
            router.push('/login?status=not_approved')
          }
        } else {
          // If not authenticated, redirect to login
          router.push('/login')
        }
      } catch (error) {
        console.error('Error checking user status:', error)
        router.push('/login')
      } finally {
        setIsLoading(false)
      }
    }

    checkUserStatus()
  }, [router])

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' })
      router.push('/login')
    } catch (error) {
      console.error('Logout error:', error)
    }
  }

  const handlePlanSelect = (planId: string) => {
    setSelectedPlan(planId)
    // Here you would typically integrate with a payment processor
    console.log('Selected plan:', planId)
  }

  const handleScheduleDemo = () => {
    // Here you would typically open a calendar booking widget
    console.log('Schedule demo clicked')
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-green-400 mx-auto mb-4"></div>
          <p className="text-green-400 text-xl font-bold">Never Offline</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <header className="bg-black border-b border-gray-800 px-6 py-4">
        <div className="flex justify-between items-center">
          <div className="text-2xl font-bold text-white">
            Never Offline
          </div>
          <div className="flex items-center space-x-4">
            <button
              onClick={() => router.push('/dashboard')}
              className="bg-gray-800 text-white px-4 py-2 rounded text-sm hover:bg-gray-700 transition-colors"
            >
              Dashboard
            </button>
            <button
              onClick={handleLogout}
              className="bg-red-600 text-white px-4 py-2 rounded text-sm hover:bg-red-700 transition-colors"
            >
              Sign Out
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="px-6 py-12">
        <div className="max-w-7xl mx-auto">
          {/* Header Section */}
          <div className="text-center mb-16">
            <h1 className="text-5xl font-bold text-white mb-4">
              Never Offline Plans
            </h1>
            <p className="text-xl text-gray-300 mb-6">
              Choose the perfect plan to supercharge your freelance success
            </p>
            <button
              onClick={handleScheduleDemo}
              className="text-green-400 hover:text-green-300 underline text-lg transition-colors"
            >
              Want to see demo? Schedule a call!
            </button>
          </div>

          {/* Pricing Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {pricingPlans.map((plan, index) => (
              <div
                key={plan.id}
                className={`relative bg-gray-900 rounded-2xl p-8 ${
                  plan.isPopular 
                    ? 'ring-2 ring-green-400 transform scale-105' 
                    : 'border border-gray-700'
                } ${
                  plan.category === 'auto' && !plan.isPopular 
                    ? 'border-green-400/30' 
                    : ''
                }`}
              >
                {/* Popular Badge */}
                {plan.isPopular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <span className="bg-green-400 text-black px-4 py-1 rounded-full text-sm font-bold">
                      Most Popular
                    </span>
                  </div>
                )}

                {/* Plan Header */}
                <div className="text-center mb-8">
                  <h3 className="text-2xl font-bold text-white mb-2">{plan.name}</h3>
                  <div className="flex items-baseline justify-center">
                    <span className="text-4xl font-bold text-green-400">{plan.price}</span>
                    <span className="text-gray-400 ml-1">{plan.period}</span>
                  </div>
                </div>

                {/* Features List */}
                <ul className="space-y-4 mb-8">
                  {plan.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-start">
                      <svg className="w-5 h-5 text-green-400 mr-3 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      <span className="text-gray-300 text-sm">{feature}</span>
                    </li>
                  ))}
                </ul>

                {/* Action Button */}
                <button
                  onClick={() => handlePlanSelect(plan.id)}
                  className={`w-full py-3 px-6 rounded-lg font-bold text-lg transition-all ${
                    plan.buttonVariant === 'primary'
                      ? 'bg-green-400 text-black hover:bg-green-300 hover:scale-105'
                      : 'bg-gray-700 text-white hover:bg-gray-600'
                  } ${
                    selectedPlan === plan.id ? 'ring-2 ring-green-400' : ''
                  }`}
                >
                  {plan.buttonText}
                </button>

                {/* Category Label */}
                {plan.category === 'auto' && (
                  <div className="mt-4 text-center">
                    <span className="text-xs text-green-400 font-medium bg-green-400/10 px-3 py-1 rounded-full">
                      Auto-Responder
                    </span>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Additional Info */}
          <div className="mt-16 text-center">
            <div className="bg-gray-900 rounded-2xl p-8 max-w-4xl mx-auto">
              <h3 className="text-2xl font-bold text-white mb-4">
                Why Choose Never Offline?
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="text-center">
                  <div className="w-16 h-16 bg-green-400 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg className="w-8 h-8 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                  </div>
                  <h4 className="text-lg font-semibold text-white mb-2">Lightning Fast</h4>
                  <p className="text-gray-400">Respond to jobs within 5 minutes of posting</p>
                </div>
                <div className="text-center">
                  <div className="w-16 h-16 bg-green-400 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg className="w-8 h-8 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <h4 className="text-lg font-semibold text-white mb-2">Smart Matching</h4>
                  <p className="text-gray-400">AI finds the perfect jobs for your skills</p>
                </div>
                <div className="text-center">
                  <div className="w-16 h-16 bg-green-400 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg className="w-8 h-8 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                    </svg>
                  </div>
                  <h4 className="text-lg font-semibold text-white mb-2">Proven Results</h4>
                  <p className="text-gray-400">15%+ conversion rate with 3x more leads</p>
                </div>
              </div>
            </div>
          </div>

          {/* FAQ Section */}
          <div className="mt-16">
            <h3 className="text-3xl font-bold text-white text-center mb-12">
              Frequently Asked Questions
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
              <div className="bg-gray-900 rounded-lg p-6">
                <h4 className="text-lg font-semibold text-white mb-3">
                  How does the auto-responder work?
                </h4>
                <p className="text-gray-400">
                  Our AI analyzes job postings and automatically sends personalized proposals based on your skills and preferences.
                </p>
              </div>
              <div className="bg-gray-900 rounded-lg p-6">
                <h4 className="text-lg font-semibold text-white mb-3">
                  Can I cancel anytime?
                </h4>
                <p className="text-gray-400">
                  Yes, you can cancel your subscription at any time. One-time purchases don't require cancellation.
                </p>
              </div>
              <div className="bg-gray-900 rounded-lg p-6">
                <h4 className="text-lg font-semibold text-white mb-3">
                  Do auto-responses expire?
                </h4>
                <p className="text-gray-400">
                  No, auto-responses never expire. You can use them at your own pace whenever you're ready.
                </p>
              </div>
              <div className="bg-gray-900 rounded-lg p-6">
                <h4 className="text-lg font-semibold text-white mb-3">
                  What platforms do you support?
                </h4>
                <p className="text-gray-400">
                  We support all major freelance platforms including Upwork, Freelancer, and many others.
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
