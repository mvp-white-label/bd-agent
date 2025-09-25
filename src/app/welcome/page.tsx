'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'

interface User {
  id: string
  email: string
  name: string
  isApproved: boolean
}

export default function WelcomePage() {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [keyword, setKeyword] = useState('')
  const [keywords, setKeywords] = useState<string[]>([])
  const [budgetRange, setBudgetRange] = useState('2,000')
  const [availability, setAvailability] = useState('20')
  const [upworkProfile, setUpworkProfile] = useState('')
  const [currentStep, setCurrentStep] = useState(1)
  const [showTutorial, setShowTutorial] = useState(false)
  const router = useRouter()

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

  const handleAddKeyword = () => {
    if (keyword.trim() && !keywords.includes(keyword.trim())) {
      setKeywords([...keywords, keyword.trim()])
      setKeyword('')
    }
  }

  const handleRemoveKeyword = (index: number) => {
    setKeywords(keywords.filter((_, i) => i !== index))
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleAddKeyword()
    }
  }

  const handleNextStep = () => {
    if (currentStep < 7) {
      setCurrentStep(currentStep + 1)
    }
  }

  const handlePrevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }

  const handleSkipTutorial = () => {
    setShowTutorial(false)
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
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-gray-800 to-green-900 relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-20 left-10 w-4 h-4 border border-green-400 transform rotate-45"></div>
        <div className="absolute top-40 right-20 w-6 h-6 border border-green-400 transform rotate-45"></div>
        <div className="absolute bottom-40 left-1/4 w-3 h-3 border border-green-400 transform rotate-45"></div>
        <div className="absolute bottom-20 right-1/3 w-5 h-5 border border-green-400 transform rotate-45"></div>
        <div className="absolute top-60 left-1/3 w-4 h-4 border border-green-400 transform rotate-45"></div>
        <div className="absolute bottom-60 right-10 w-3 h-3 border border-green-400 transform rotate-45"></div>
      </div>

      {/* Header */}
      <header className="relative z-10 p-6">
        <div className="flex justify-between items-center">
          <div className="text-green-400 text-2xl font-bold">
            Never Offline
          </div>
              <div className="flex space-x-4">
                <button
                  onClick={() => router.push('/dashboard')}
                  className="bg-green-400 text-black px-6 py-2 rounded-lg font-medium hover:bg-green-300 transition-colors"
                >
                  Dashboard
                </button>
                <button
                  onClick={() => router.push('/profile')}
                  className="bg-gray-800 text-white px-6 py-2 rounded-lg font-medium hover:bg-gray-700 transition-colors"
                >
                  Profile
                </button>
                <button
                  onClick={handleLogout}
                  className="bg-black text-white px-6 py-2 rounded-lg font-medium hover:bg-gray-800 transition-colors"
                >
                  Sign Out
                </button>
              </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="relative z-10 px-6 py-12">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-6xl md:text-7xl font-bold text-white mb-6">
            AI will find relevant{' '}
            <span className="text-green-400">freelance</span>{' '}
            jobs and respond in 5 min
          </h1>
          <p className="text-xl text-gray-300 mb-8">
            As a result: &gt;15% chat conversion, with 3X more available leads
          </p>
          
          {/* Stats Section */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto mb-12">
            <div className="bg-gray-800/50 rounded-lg p-6 border border-gray-700">
              <div className="text-3xl font-bold text-green-400 mb-2">15%+</div>
              <div className="text-gray-300">Chat Conversion Rate</div>
            </div>
            <div className="bg-gray-800/50 rounded-lg p-6 border border-gray-700">
              <div className="text-3xl font-bold text-green-400 mb-2">3X</div>
              <div className="text-gray-300">More Available Leads</div>
            </div>
            <div className="bg-gray-800/50 rounded-lg p-6 border border-gray-700">
              <div className="text-3xl font-bold text-green-400 mb-2">5min</div>
              <div className="text-gray-300">Response Time</div>
            </div>
          </div>
        </div>

        {/* Onboarding Steps */}
        <div className="w-full max-w-6xl mx-auto">
          {/* Progress Bar */}
          <div className="mb-8">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold text-white">Setup Your Profile</h2>
                  <span className="text-green-400 font-medium">Step {currentStep} of 7</span>
            </div>
            <div className="w-full bg-gray-700 rounded-full h-2">
              <div 
                className="bg-green-400 h-2 rounded-full transition-all duration-300"
                style={{ width: `${(currentStep / 7) * 100}%` }}
              ></div>
            </div>
          </div>

          {/* Step Content */}
          <div className="bg-gradient-to-r from-green-800 to-green-700 rounded-2xl p-8 shadow-2xl border border-green-500/20 mb-8">
            {currentStep === 1 && (
              <div>
                <h3 className="text-green-400 text-3xl font-bold mb-4">
                  Step 1 - Write Your Keywords
                </h3>
                <p className="text-gray-300 text-lg mb-6">
                  Enter the exact same keywords you use when searching for freelance jobs. This helps our AI find the most relevant opportunities for you.
                </p>
                
                <div className="flex gap-4 mb-6">
                  <input
                    type="text"
                    value={keyword}
                    onChange={(e) => setKeyword(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Enter your keyword for job searching"
                    className="flex-1 bg-gray-800 text-white px-4 py-3 rounded-lg border border-gray-600 focus:border-green-400 focus:outline-none"
                  />
                  <button
                    onClick={handleAddKeyword}
                    className="bg-green-400 text-black px-8 py-3 rounded-lg font-medium hover:bg-green-300 transition-colors"
                  >
                    Add
                  </button>
                </div>

                {keywords.length > 0 && (
                  <div className="mb-6">
                    <h4 className="text-white text-lg mb-3">Your Keywords:</h4>
                    <div className="flex flex-wrap gap-2">
                      {keywords.map((kw, index) => (
                        <div
                          key={index}
                          className="bg-gray-700 text-white px-4 py-2 rounded-lg flex items-center gap-2"
                        >
                          <span>{kw}</span>
                          <button
                            onClick={() => handleRemoveKeyword(index)}
                            className="text-red-400 hover:text-red-300"
                          >
                            ×
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {currentStep === 2 && (
              <div>
                <h3 className="text-green-400 text-3xl font-bold mb-4">
                  Step 2 - Your Experience Level
                </h3>
                <p className="text-gray-300 text-lg mb-6">
                  Tell us about your experience level so we can target the right job opportunities.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {['Beginner', 'Intermediate', 'Expert'].map((level) => (
                    <button
                      key={level}
                      className="bg-gray-800 text-white p-4 rounded-lg border border-gray-600 hover:border-green-400 transition-colors"
                    >
                      {level}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {currentStep === 3 && (
              <div>
                <h3 className="text-green-400 text-3xl font-bold mb-4">
                  Step 3 - Preferred Job Types
                </h3>
                <p className="text-gray-300 text-lg mb-6">
                  Select the types of freelance work you're interested in.
                </p>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {['Web Development', 'Mobile Apps', 'Design', 'Writing', 'Marketing', 'Data Analysis', 'Consulting', 'Other'].map((type) => (
                    <button
                      key={type}
                      className="bg-gray-800 text-white p-3 rounded-lg border border-gray-600 hover:border-green-400 transition-colors text-sm"
                    >
                      {type}
                    </button>
                  ))}
                </div>
              </div>
            )}

                {currentStep === 4 && (
                  <div>
                    <h3 className="text-green-400 text-3xl font-bold mb-4">
                      Step 4 - Budget Range
                    </h3>
                    <p className="text-gray-300 text-lg mb-6">
                      What's your preferred budget range for projects?
                    </p>
                    <div className="flex items-center justify-center space-x-4">
                      <button
                        onClick={() => {
                          const currentValue = parseInt(budgetRange.replace(/[$,]/g, ''))
                          if (currentValue > 1) {
                            setBudgetRange((currentValue - 1).toLocaleString())
                          }
                        }}
                        className="bg-gray-800 text-white p-3 rounded-lg border border-gray-600 hover:border-green-400 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        disabled={parseInt(budgetRange.replace(/[$,]/g, '')) <= 1}
                      >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                        </svg>
                      </button>
                      
                      <div className="bg-gray-800 border border-gray-600 rounded-lg px-6 py-4 min-w-[200px] text-center">
                        <div className="text-2xl font-bold text-white mb-1">
                          $<input
                            type="text"
                            value={budgetRange}
                            onChange={(e) => {
                              const value = e.target.value.replace(/[^0-9]/g, '')
                              if (value === '' || parseInt(value) >= 1) {
                                setBudgetRange(value === '' ? '0' : parseInt(value).toLocaleString())
                              }
                            }}
                            onBlur={(e) => {
                              const value = e.target.value.replace(/[^0-9]/g, '')
                              if (value === '' || parseInt(value) < 1) {
                                setBudgetRange('1')
                              }
                            }}
                            className="bg-transparent text-white text-2xl font-bold text-center w-full border-none outline-none"
                            style={{ width: `${Math.max(budgetRange.length * 12, 60)}px` }}
                          />
                        </div>
                        <div className="text-sm text-gray-400">Budget Range</div>
                      </div>
                      
                      <button
                        onClick={() => {
                          const currentValue = parseInt(budgetRange.replace(/[$,]/g, ''))
                          setBudgetRange((currentValue + 1).toLocaleString())
                        }}
                        className="bg-gray-800 text-white p-3 rounded-lg border border-gray-600 hover:border-green-400 transition-colors"
                      >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                        </svg>
                      </button>
                    </div>
                    
                    <div className="mt-6 text-center">
                      <p className="text-gray-400 text-sm">
                        Use the stepper buttons or type directly to set your preferred budget range
                      </p>
                    </div>
                  </div>
                )}

            {currentStep === 5 && (
              <div>
                <h3 className="text-green-400 text-3xl font-bold mb-4">
                  Step 5 - Availability
                </h3>
                <p className="text-gray-300 text-lg mb-6">
                  How many hours per week can you dedicate to freelance work?
                </p>
                <div className="flex items-center justify-center space-x-4">
                  <button
                    onClick={() => {
                      const currentValue = parseInt(availability.replace(/[^0-9]/g, ''))
                      if (currentValue > 1) {
                        setAvailability((currentValue - 1).toString())
                      }
                    }}
                    className="bg-gray-800 text-white p-3 rounded-lg border border-gray-600 hover:border-green-400 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    disabled={parseInt(availability.replace(/[^0-9]/g, '')) <= 1}
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                    </svg>
                  </button>
                  
                  <div className="bg-gray-800 border border-gray-600 rounded-lg px-6 py-4 min-w-[200px] text-center">
                    <div className="text-2xl font-bold text-white mb-1">
                      <input
                        type="text"
                        value={availability}
                        onChange={(e) => {
                          const value = e.target.value.replace(/[^0-9]/g, '')
                          if (value === '' || parseInt(value) >= 1) {
                            setAvailability(value === '' ? '0' : value)
                          }
                        }}
                        onBlur={(e) => {
                          const value = e.target.value.replace(/[^0-9]/g, '')
                          if (value === '' || parseInt(value) < 1) {
                            setAvailability('1')
                          }
                        }}
                        className="bg-transparent text-white text-2xl font-bold text-center w-full border-none outline-none"
                        style={{ width: `${Math.max(availability.length * 12, 60)}px` }}
                      />
                      <span className="text-2xl font-bold text-white ml-1">hours/week</span>
                    </div>
                    <div className="text-sm text-gray-400">Weekly Availability</div>
                  </div>
                  
                  <button
                    onClick={() => {
                      const currentValue = parseInt(availability.replace(/[^0-9]/g, ''))
                      setAvailability((currentValue + 1).toString())
                    }}
                    className="bg-gray-800 text-white p-3 rounded-lg border border-gray-600 hover:border-green-400 transition-colors"
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                  </button>
                </div>
                
                <div className="mt-6 text-center">
                  <p className="text-gray-400 text-sm">
                    Use the stepper buttons or type directly to set your weekly availability
                  </p>
                </div>
              </div>
            )}

            {currentStep === 6 && (
              <div>
                <h3 className="text-green-400 text-3xl font-bold mb-4">
                  Step 6 - Share Your Upwork Profile Link
                </h3>
                <p className="text-gray-300 text-lg mb-6">
                  We will scrape info about your services and case studies to teach AI how to create better job responses.
                </p>
                
                <div>
                  <label className="block text-white text-lg font-medium mb-3">
                    Your Upwork profile link
                  </label>
                  <input
                    type="url"
                    value={upworkProfile}
                    onChange={(e) => setUpworkProfile(e.target.value)}
                    placeholder="https://www.upwork.com/freelancers/~01234567890"
                    className="w-full bg-gray-800 text-white border border-gray-600 rounded-lg px-4 py-3 focus:border-green-400 focus:outline-none text-lg"
                  />
                  <p className="text-gray-400 text-sm mt-2">
                    Example: https://www.upwork.com/freelancers/~01234567890
                  </p>
                </div>
              </div>
            )}

            {currentStep === 7 && (
              <div>
                <h3 className="text-green-400 text-3xl font-bold mb-4">
                  Step 7 - Ready to Start!
                </h3>
                <p className="text-gray-300 text-lg mb-6">
                  Perfect! Your profile is set up. Our AI will now start finding and applying to relevant freelance jobs for you.
                </p>
                <div className="bg-gray-800/50 rounded-lg p-6 border border-gray-700">
                  <h4 className="text-white text-lg font-semibold mb-3">What happens next?</h4>
                  <ul className="text-gray-300 space-y-2">
                    <li>• AI searches for jobs matching your criteria</li>
                    <li>• Automatically applies with personalized proposals</li>
                    <li>• Tracks application status and responses</li>
                    <li>• Notifies you when clients respond</li>
                  </ul>
                </div>
              </div>
            )}

            {/* Navigation Buttons */}
            <div className="flex justify-between mt-8">
              <button
                onClick={handlePrevStep}
                disabled={currentStep === 1}
                className="bg-gray-700 text-white px-6 py-3 rounded-lg font-medium hover:bg-gray-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Previous
              </button>
                  <button
                    onClick={handleNextStep}
                    disabled={currentStep === 7}
                    className="bg-green-400 text-black px-8 py-3 rounded-lg font-medium hover:bg-green-300 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {currentStep === 7 ? 'Complete Setup' : 'Next Step'}
                  </button>
            </div>
          </div>
        </div>

        {/* Features Section */}
        <div className="w-full max-w-6xl mx-auto mb-12">
          <h2 className="text-3xl font-bold text-white text-center mb-8">Why Choose Never Offline?</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-gray-800/30 rounded-lg p-6 border border-gray-700">
              <div className="w-12 h-12 bg-green-400 rounded-lg flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">Lightning Fast</h3>
              <p className="text-gray-300">AI responds to job postings within 5 minutes of them going live.</p>
            </div>
            <div className="bg-gray-800/30 rounded-lg p-6 border border-gray-700">
              <div className="w-12 h-12 bg-green-400 rounded-lg flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">Smart Matching</h3>
              <p className="text-gray-300">Advanced AI finds jobs that perfectly match your skills and preferences.</p>
            </div>
            <div className="bg-gray-800/30 rounded-lg p-6 border border-gray-700">
              <div className="w-12 h-12 bg-green-400 rounded-lg flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">Real-time Tracking</h3>
              <p className="text-gray-300">Monitor all your applications and responses in one dashboard.</p>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 text-center pb-8">
        <div className="max-w-4xl mx-auto">
          <button 
            onClick={() => setShowTutorial(true)}
            className="bg-black text-white px-8 py-3 rounded-lg font-medium hover:bg-gray-800 transition-colors mb-8"
          >
            Watch tutorial from the founder
          </button>
          
          <div className="text-gray-400 text-sm">
            <p className="mb-2">Ready to get started? Complete your profile setup above.</p>
            <p>Questions? Contact us at support@neveroffline.com</p>
          </div>
        </div>
      </footer>

      {/* Tutorial Modal */}
      {showTutorial && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-900 rounded-lg max-w-2xl w-full p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-2xl font-bold text-white">Tutorial from the Founder</h3>
              <button
                onClick={handleSkipTutorial}
                className="text-gray-400 hover:text-white"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="aspect-video bg-gray-800 rounded-lg mb-4 flex items-center justify-center">
              <div className="text-center">
                <div className="w-16 h-16 bg-green-400 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-black" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M8 5v14l11-7z"/>
                  </svg>
                </div>
                <p className="text-white">Tutorial Video Coming Soon</p>
              </div>
            </div>
            <p className="text-gray-300 mb-4">
              Learn how to maximize your freelance success with Never Offline. This tutorial will show you how to set up your profile for optimal job matching and response rates.
            </p>
            <div className="flex gap-4">
              <button
                onClick={handleSkipTutorial}
                className="flex-1 bg-gray-700 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition-colors"
              >
                Skip for Now
              </button>
              <button
                onClick={handleSkipTutorial}
                className="flex-1 bg-green-400 text-black px-4 py-2 rounded-lg hover:bg-green-300 transition-colors"
              >
                Got It
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
