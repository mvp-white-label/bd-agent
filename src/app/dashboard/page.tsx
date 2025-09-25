'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'

interface User {
  id: string
  email: string
  name: string
  isApproved: boolean
}

interface Job {
  id: string
  title: string
  budget: string
  posted: string
  status: string
  matchScore: number
  feedName: string
  userRating?: 'like' | 'dislike' | null
  dislikeReason?: string
}

export default function DashboardPage() {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('All')
  const [autoResponder, setAutoResponder] = useState(false)
  const [jobs, setJobs] = useState<Job[]>([])
  const [filteredJobs, setFilteredJobs] = useState<Job[]>([])
  const [showDislikeReason, setShowDislikeReason] = useState<string | null>(null)
  const [dislikeReason, setDislikeReason] = useState('')
  const [subscription, setSubscription] = useState<{
    plan: string
    status: 'active' | 'trial' | 'expired' | 'none'
    autoResponses?: number
    usedResponses?: number
  } | null>(null)
  const [showSubscriptionDetails, setShowSubscriptionDetails] = useState(false)
  const router = useRouter()

  // Sample job data
  const initialJobs: Job[] = [
    {
      id: '1',
      title: 'Data quality support for Fashion e-commerce sites',
      budget: 'Budget not specified',
      posted: 'Sep 25, 2025 8:18 PM',
      status: 'None',
      matchScore: 100,
      feedName: 'Your feed name'
    },
    {
      id: '2',
      title: 'HIPAA-Compliant WordPress Telemedicine Website Developer with Integrations',
      budget: 'Budget not specified',
      posted: 'Sep 25, 2025 6:18 PM',
      status: 'None',
      matchScore: 0,
      feedName: 'Your feed name'
    },
    {
      id: '3',
      title: 'QA tester for WordPress + WooCommerce project',
      budget: 'Budget not specified',
      posted: 'Sep 25, 2025 5:20 PM',
      status: 'None',
      matchScore: 100,
      feedName: 'Your feed name'
    },
    {
      id: '4',
      title: 'Casino Game User Tester in Michigan',
      budget: 'Budget not specified',
      posted: 'Sep 25, 2025 4:15 PM',
      status: 'None',
      matchScore: 0,
      feedName: 'Your feed name'
    },
    {
      id: '5',
      title: 'React Native Mobile App Developer for E-commerce Platform',
      budget: '$5,000 - $10,000',
      posted: 'Sep 25, 2025 3:45 PM',
      status: 'Matched',
      matchScore: 100,
      feedName: 'Tech Jobs Feed'
    },
    {
      id: '6',
      title: 'Full-Stack Developer for SaaS Dashboard',
      budget: '$3,000 - $7,000',
      posted: 'Sep 25, 2025 2:30 PM',
      status: 'Applied',
      matchScore: 100,
      feedName: 'Web Development Feed'
    },
    {
      id: '7',
      title: 'UI/UX Designer for Healthcare App',
      budget: '$2,000 - $5,000',
      posted: 'Sep 25, 2025 1:15 PM',
      status: 'None',
      matchScore: 0,
      feedName: 'Design Jobs Feed'
    },
    {
      id: '8',
      title: 'Python Django Backend Developer',
      budget: '$4,000 - $8,000',
      posted: 'Sep 25, 2025 12:00 PM',
      status: 'Matched',
      matchScore: 100,
      feedName: 'Backend Jobs Feed'
    },
    {
      id: '9',
      title: 'Content Writer for Tech Blog',
      budget: '$500 - $1,500',
      posted: 'Sep 25, 2025 11:30 AM',
      status: 'None',
      matchScore: 0,
      feedName: 'Writing Jobs Feed'
    },
    {
      id: '10',
      title: 'DevOps Engineer for Cloud Migration',
      budget: '$6,000 - $12,000',
      posted: 'Sep 25, 2025 10:45 AM',
      status: 'Applied',
      matchScore: 100,
      feedName: 'DevOps Jobs Feed'
    },
    {
      id: '11',
      title: 'Vue.js Frontend Developer',
      budget: '$3,500 - $7,500',
      posted: 'Sep 25, 2025 9:20 AM',
      status: 'None',
      matchScore: 0,
      feedName: 'Frontend Jobs Feed'
    },
    {
      id: '12',
      title: 'Machine Learning Engineer for Recommendation System',
      budget: '$8,000 - $15,000',
      posted: 'Sep 25, 2025 8:10 AM',
      status: 'Matched',
      matchScore: 100,
      feedName: 'AI/ML Jobs Feed'
    },
    {
      id: '13',
      title: 'Node.js API Developer with MongoDB',
      budget: '$2,500 - $6,000',
      posted: 'Sep 24, 2025 11:55 PM',
      status: 'None',
      matchScore: 0,
      feedName: 'API Development Feed'
    },
    {
      id: '14',
      title: 'Flutter Mobile App Developer',
      budget: '$4,500 - $9,000',
      posted: 'Sep 24, 2025 10:30 PM',
      status: 'Applied',
      matchScore: 100,
      feedName: 'Mobile Development Feed'
    },
    {
      id: '15',
      title: 'WordPress Plugin Developer',
      budget: '$1,000 - $3,000',
      posted: 'Sep 24, 2025 9:15 PM',
      status: 'None',
      matchScore: 0,
      feedName: 'WordPress Jobs Feed'
    },
    {
      id: '16',
      title: 'Angular Developer for Enterprise Application',
      budget: '$5,500 - $11,000',
      posted: 'Sep 24, 2025 8:00 PM',
      status: 'Matched',
      matchScore: 100,
      feedName: 'Enterprise Jobs Feed'
    },
    {
      id: '17',
      title: 'Social Media Manager for Tech Startup',
      budget: '$1,500 - $3,500',
      posted: 'Sep 24, 2025 7:30 PM',
      status: 'None',
      matchScore: 0,
      feedName: 'Marketing Jobs Feed'
    },
    {
      id: '18',
      title: 'Blockchain Developer for DeFi Project',
      budget: '$10,000 - $20,000',
      posted: 'Sep 24, 2025 6:45 PM',
      status: 'Applied',
      matchScore: 100,
      feedName: 'Blockchain Jobs Feed'
    },
    {
      id: '19',
      title: 'GraphQL API Developer',
      budget: '$3,000 - $7,000',
      posted: 'Sep 24, 2025 5:20 PM',
      status: 'None',
      matchScore: 0,
      feedName: 'API Development Feed'
    },
    {
      id: '20',
      title: 'iOS Swift Developer for Fitness App',
      budget: '$4,000 - $8,500',
      posted: 'Sep 24, 2025 4:10 PM',
      status: 'Matched',
      matchScore: 100,
      feedName: 'iOS Jobs Feed'
    },
    {
      id: '21',
      title: 'Data Analyst for E-commerce Company',
      budget: '$2,000 - $5,000',
      posted: 'Sep 24, 2025 3:25 PM',
      status: 'None',
      matchScore: 0,
      feedName: 'Data Jobs Feed'
    },
    {
      id: '22',
      title: 'Laravel PHP Developer for CRM System',
      budget: '$3,500 - $7,500',
      posted: 'Sep 24, 2025 2:40 PM',
      status: 'Applied',
      matchScore: 100,
      feedName: 'PHP Jobs Feed'
    },
    {
      id: '23',
      title: 'React Developer for Dashboard Redesign',
      budget: '$2,800 - $6,200',
      posted: 'Sep 24, 2025 1:55 PM',
      status: 'None',
      matchScore: 0,
      feedName: 'React Jobs Feed'
    },
    {
      id: '24',
      title: 'AWS Cloud Architect',
      budget: '$7,000 - $14,000',
      posted: 'Sep 24, 2025 12:30 PM',
      status: 'Matched',
      matchScore: 100,
      feedName: 'Cloud Jobs Feed'
    },
    {
      id: '25',
      title: 'Technical Writer for API Documentation',
      budget: '$800 - $2,000',
      posted: 'Sep 24, 2025 11:45 AM',
      status: 'None',
      matchScore: 0,
      feedName: 'Technical Writing Feed'
    },
    {
      id: '26',
      title: 'Next.js Full-Stack Developer',
      budget: '$4,200 - $9,000',
      posted: 'Sep 24, 2025 10:20 AM',
      status: 'Applied',
      matchScore: 100,
      feedName: 'Next.js Jobs Feed'
    },
    {
      id: '27',
      title: 'Docker Kubernetes Specialist',
      budget: '$5,000 - $10,000',
      posted: 'Sep 24, 2025 9:35 AM',
      status: 'None',
      matchScore: 0,
      feedName: 'Containerization Jobs Feed'
    },
    {
      id: '28',
      title: 'TypeScript Developer for Enterprise App',
      budget: '$3,800 - $8,500',
      posted: 'Sep 24, 2025 8:50 AM',
      status: 'Matched',
      matchScore: 100,
      feedName: 'TypeScript Jobs Feed'
    },
    {
      id: '29',
      title: 'Digital Marketing Specialist',
      budget: '$1,200 - $3,000',
      posted: 'Sep 24, 2025 8:05 AM',
      status: 'None',
      matchScore: 0,
      feedName: 'Digital Marketing Feed'
    },
    {
      id: '30',
      title: 'Microservices Architecture Developer',
      budget: '$6,500 - $13,000',
      posted: 'Sep 24, 2025 7:20 AM',
      status: 'Applied',
      matchScore: 100,
      feedName: 'Microservices Jobs Feed'
    }
  ]

  useEffect(() => {
    setJobs(initialJobs)
    setFilteredJobs(initialJobs)
    
    // Default to no subscription (unsubscribed state)
    setSubscription({
      plan: 'None',
      status: 'none',
      autoResponses: 0,
      usedResponses: 0
    })
  }, [])

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (showSubscriptionDetails) {
        const target = event.target as Element
        if (!target.closest('.subscription-dropdown')) {
          setShowSubscriptionDetails(false)
        }
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [showSubscriptionDetails])

  // Filter jobs based on active tab
  useEffect(() => {
    if (activeTab === 'All') {
      setFilteredJobs(jobs)
    } else {
      setFilteredJobs(jobs.filter(job => job.status === activeTab))
    }
  }, [activeTab, jobs])

  useEffect(() => {
    const checkUserStatus = async () => {
      try {
        const response = await fetch('/api/auth/me')
        if (response.ok) {
          const data = await response.json()
          setUser(data.user)
          
          // If user is not approved, redirect to pending approval
          if (!data.user.isApproved) {
            router.push('/pending-approval')
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

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Matched':
        return 'text-green-400'
      case 'Applied':
        return 'text-blue-400'
      case 'Rejected':
        return 'text-red-400'
      case 'None':
        return 'text-gray-400'
      default:
        return 'text-gray-400'
    }
  }

  const handleStatusChange = (jobId: string, newStatus: string) => {
    setJobs(jobs.map(job => 
      job.id === jobId ? { ...job, status: newStatus } : job
    ))
  }

  const handleLikeDislike = (jobId: string, rating: 'like' | 'dislike') => {
    if (rating === 'dislike') {
      setShowDislikeReason(jobId)
      setDislikeReason('')
    } else {
      setJobs(jobs.map(job => 
        job.id === jobId ? { ...job, userRating: rating, dislikeReason: undefined } : job
      ))
    }
  }

  const handleDislikeReasonSubmit = (jobId: string) => {
    if (dislikeReason.trim()) {
      setJobs(jobs.map(job => 
        job.id === jobId ? { ...job, userRating: 'dislike', dislikeReason: dislikeReason } : job
      ))
      setShowDislikeReason(null)
      setDislikeReason('')
    }
  }

  const handleDislikeReasonCancel = () => {
    setShowDislikeReason(null)
    setDislikeReason('')
  }

  const getSubscriptionButtonText = () => {
    if (!subscription || subscription.status === 'none') {
      return 'Trial ended, subscribe here'
    }
    
    switch (subscription.status) {
      case 'active':
        return `${subscription.plan} Plan`
      case 'trial':
        return `${subscription.plan} Trial`
      case 'expired':
        return 'Subscription Expired'
      default:
        return 'Trial ended, subscribe here'
    }
  }

  const getSubscriptionButtonColor = () => {
    if (!subscription || subscription.status === 'none' || subscription.status === 'expired') {
      return 'bg-red-600 hover:bg-red-700'
    }
    
    switch (subscription.status) {
      case 'active':
        return 'bg-green-600 hover:bg-green-700'
      case 'trial':
        return 'bg-yellow-600 hover:bg-yellow-700'
      default:
        return 'bg-red-600 hover:bg-red-700'
    }
  }

  const handleSubscriptionClick = () => {
    if (!subscription || subscription.status === 'none' || subscription.status === 'expired') {
      router.push('/pricing')
    } else {
      setShowSubscriptionDetails(!showSubscriptionDetails)
    }
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
      {/* Top Header */}
      <header className="bg-black border-b border-gray-800 px-6 py-4">
        <div className="flex justify-between items-center">
          <div className="text-2xl font-bold text-white">
            Never Offline
          </div>
              <div className="flex items-center space-x-4">
                <div className="relative">
                  <button
                    onClick={handleSubscriptionClick}
                    className={`text-white px-4 py-2 rounded text-sm transition-colors ${getSubscriptionButtonColor()}`}
                  >
                    {getSubscriptionButtonText()}
                  </button>
                  
                  {/* Subscription Details Dropdown */}
                  {showSubscriptionDetails && subscription && subscription.status !== 'none' && (
                    <div className="subscription-dropdown absolute top-full right-0 mt-2 w-80 bg-gray-900 border border-gray-700 rounded-lg shadow-xl z-50">
                      <div className="p-4">
                        <div className="flex justify-between items-start mb-3">
                          <h3 className="text-lg font-semibold text-white">Subscription Details</h3>
                          <button
                            onClick={() => setShowSubscriptionDetails(false)}
                            className="text-gray-400 hover:text-white"
                          >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                          </button>
                        </div>
                        
                        <div className="space-y-3">
                          <div className="flex justify-between">
                            <span className="text-gray-400">Plan:</span>
                            <span className="text-white font-medium">{subscription.plan}</span>
                          </div>
                          
                          <div className="flex justify-between">
                            <span className="text-gray-400">Status:</span>
                            <span className={`font-medium ${
                              subscription.status === 'active' ? 'text-green-400' : 
                              subscription.status === 'trial' ? 'text-yellow-400' : 
                              'text-red-400'
                            }`}>
                              {subscription.status.charAt(0).toUpperCase() + subscription.status.slice(1)}
                            </span>
                          </div>
                          
                          {subscription.autoResponses && subscription.autoResponses > 0 && (
                            <>
                              <div className="flex justify-between">
                                <span className="text-gray-400">Auto-responses:</span>
                                <span className="text-white font-medium">
                                  {subscription.usedResponses || 0} / {subscription.autoResponses}
                                </span>
                              </div>
                              
                              <div className="w-full bg-gray-700 rounded-full h-2">
                                <div 
                                  className="bg-green-400 h-2 rounded-full"
                                  style={{ 
                                    width: `${((subscription.usedResponses || 0) / subscription.autoResponses) * 100}%` 
                                  }}
                                ></div>
                              </div>
                            </>
                          )}
                          
                          <div className="pt-3 border-t border-gray-700">
                            <button
                              onClick={() => {
                                setShowSubscriptionDetails(false)
                                router.push('/pricing')
                              }}
                              className="w-full bg-green-400 text-black px-4 py-2 rounded text-sm font-medium hover:bg-green-300 transition-colors"
                            >
                              Manage Subscription
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
            <button className="bg-green-400 text-black px-4 py-2 rounded text-sm font-medium">
              Set-up auto-responses
            </button>
            <button className="text-gray-400 hover:text-white">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-5 5-5-5h5v-5a7.5 7.5 0 1 0-15 0v5h5l-5 5-5-5h5v-5a7.5 7.5 0 1 1 15 0v5z" />
              </svg>
            </button>
            <div className="w-8 h-8 bg-gray-600 rounded-full flex items-center justify-center">
              <span className="text-sm font-medium">{user?.name?.charAt(0) || 'A'}</span>
            </div>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar */}
        <aside className="w-64 bg-gray-900 min-h-screen">
          <nav className="p-6">
            <ul className="space-y-4">
                  <li>
                    <button className="flex items-center space-x-3 w-full text-left text-green-400 bg-gray-800 px-4 py-3 rounded-lg">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z" />
                      </svg>
                      <span>Dashboard</span>
                    </button>
                  </li>
                  <li>
                    <button 
                      onClick={() => router.push('/profile')}
                      className="flex items-center space-x-3 w-full text-left text-gray-400 hover:text-white px-4 py-3 rounded-lg"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                      <span>Profile</span>
                    </button>
                  </li>
                  <li>
                    <button 
                      onClick={() => router.push('/notifications')}
                      className="flex items-center space-x-3 w-full text-left text-gray-400 hover:text-white px-4 py-3 rounded-lg"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-5 5-5-5h5v-5a7.5 7.5 0 1 0-15 0v5h5l-5 5-5-5h5v-5a7.5 7.5 0 1 1 15 0v5z" />
                      </svg>
                      <span>Notifications</span>
                    </button>
                  </li>
              <li>
                <button className="flex items-center space-x-3 w-full text-left text-gray-400 hover:text-white px-4 py-3 rounded-lg">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                  </svg>
                  <span>Tinder</span>
                </button>
              </li>
              <li>
                <button className="flex items-center space-x-3 w-full text-left text-gray-400 hover:text-white px-4 py-3 rounded-lg">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                  </svg>
                  <span>Prompts</span>
                </button>
              </li>
              <li>
                <button className="flex items-center space-x-3 w-full text-left text-gray-400 hover:text-white px-4 py-3 rounded-lg">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  <span>Settings</span>
                </button>
              </li>
            </ul>
            
            <div className="mt-8">
              <button className="w-full bg-gray-800 text-white px-4 py-3 rounded-lg text-sm">
                See tutorial
              </button>
            </div>
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-6">
          <h1 className="text-3xl font-bold text-white mb-8">Jobs Dashboard</h1>
          
              {/* Stats Cards */}
              <div className="grid grid-cols-4 gap-6 mb-8">
                <div className="bg-gray-800 rounded-lg p-6">
                  <div className="text-3xl font-bold text-green-400">{filteredJobs.length}</div>
                  <div className="text-gray-400 text-sm">{activeTab === 'All' ? 'All Jobs' : `${activeTab} Jobs`}</div>
                </div>
                <div className="bg-gray-800 rounded-lg p-6">
                  <div className="text-3xl font-bold text-green-400">{jobs.filter(job => job.status === 'Matched').length}</div>
                  <div className="text-gray-400 text-sm">Total Matched Jobs</div>
                </div>
                <div className="bg-gray-800 rounded-lg p-6">
                  <div className="text-3xl font-bold text-green-400">{jobs.filter(job => job.status === 'Applied').length}</div>
                  <div className="text-gray-400 text-sm">Responses Sent</div>
                </div>
                <div className="bg-gray-800 rounded-lg p-6">
                  <div className="text-3xl font-bold text-green-400">{jobs.filter(job => job.status === 'None').length}</div>
                  <div className="text-gray-400 text-sm">U-coins - auto-responses left</div>
                </div>
              </div>

          {/* Recent Jobs Section */}
          <div className="bg-gray-900 rounded-lg p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold text-white">Recent Jobs</h2>
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <span className="text-gray-400 text-sm">Auto-responder</span>
                  <button
                    onClick={() => setAutoResponder(!autoResponder)}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                      autoResponder ? 'bg-green-400' : 'bg-gray-600'
                    }`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                        autoResponder ? 'translate-x-6' : 'translate-x-1'
                      }`}
                    />
                  </button>
                  <span className="text-gray-400 text-sm">
                    {autoResponder ? 'Active' : 'Inactive'}
                  </span>
                </div>
              </div>
            </div>

            {/* Filter Tabs */}
            <div className="flex space-x-4 mb-6">
              {['All', 'Matched', 'Applied', 'Rejected'].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium ${
                    activeTab === tab
                      ? 'bg-green-400 text-black'
                      : 'bg-gray-800 text-gray-400 hover:text-white'
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>

            {/* Jobs Table */}
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-700">
                    <th className="text-left py-3 px-4 text-gray-400 font-medium">JOB TITLE</th>
                    <th className="text-left py-3 px-4 text-gray-400 font-medium">BUDGET</th>
                    <th className="text-left py-3 px-4 text-gray-400 font-medium">POSTED (ASIA/CALCUTTA)</th>
                    <th className="text-left py-3 px-4 text-gray-400 font-medium">STATUS</th>
                    <th className="text-left py-3 px-4 text-gray-400 font-medium">MATCH SCORE</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredJobs.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="py-8 px-4 text-center text-gray-400">
                        <div className="flex flex-col items-center">
                          <svg className="w-12 h-12 text-gray-600 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                          </svg>
                          <p className="text-lg font-medium">No {activeTab.toLowerCase()} jobs found</p>
                          <p className="text-sm">Try selecting a different filter or check back later for new opportunities.</p>
                        </div>
                      </td>
                    </tr>
                  ) : (
                    filteredJobs.map((job) => (
                      <tr key={job.id} className="border-b border-gray-800 hover:bg-gray-800/50">
                        <td className="py-4 px-4">
                          <div>
                            <div className="text-white font-medium">{job.title}</div>
                            <div className="text-gray-400 text-sm">{job.feedName}</div>
                          </div>
                        </td>
                        <td className="py-4 px-4">
                          <span className="text-green-400">{job.budget}</span>
                        </td>
                        <td className="py-4 px-4 text-gray-400">{job.posted}</td>
                        <td className="py-4 px-4">
                          <select
                            value={job.status}
                            onChange={(e) => handleStatusChange(job.id, e.target.value)}
                            className="bg-gray-800 text-white border border-gray-600 rounded px-3 py-1 text-sm focus:border-green-400 focus:outline-none"
                          >
                            <option value="None">None</option>
                            <option value="Applied">Applied</option>
                            <option value="Matched">Matched</option>
                            <option value="Rejected">Rejected</option>
                          </select>
                        </td>
                        <td className="py-4 px-4">
                          <div className="flex items-center mb-2">
                            <div className="w-16 bg-gray-700 rounded-full h-2 mr-2">
                              <div 
                                className={`h-2 rounded-full ${
                                  job.matchScore === 100 ? 'bg-green-400' : 'bg-red-400'
                                }`}
                                style={{ width: `${job.matchScore}%` }}
                              ></div>
                            </div>
                            <span className={`text-sm ${
                              job.matchScore === 100 ? 'text-green-400' : 'text-red-400'
                            }`}>
                              {job.matchScore}%
                            </span>
                          </div>
                          
                          {/* Like/Dislike Buttons */}
                          <div className="flex items-center space-x-2">
                            <button
                              onClick={() => handleLikeDislike(job.id, 'like')}
                              className={`p-1 rounded ${
                                job.userRating === 'like' 
                                  ? 'bg-green-400 text-black' 
                                  : 'bg-gray-700 text-gray-400 hover:bg-gray-600'
                              }`}
                              title="Like this match"
                            >
                              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                <path d="M2 10.5a1.5 1.5 0 113 0v6a1.5 1.5 0 01-3 0v-6zM6 10.333v5.894a2 2 0 001.106 1.79l.05.025A4 4 0 008.943 18h5.416a2 2 0 001.962-1.608l1.2-6A2 2 0 0015.56 8H12V4a2 2 0 00-2-2 1 1 0 00-1 1v.667a4 4 0 01-.8 2.4L6.8 7.933a4 4 0 00-.8 2.4z" />
                              </svg>
                            </button>
                            <button
                              onClick={() => handleLikeDislike(job.id, 'dislike')}
                              className={`p-1 rounded ${
                                job.userRating === 'dislike' 
                                  ? 'bg-red-400 text-black' 
                                  : 'bg-gray-700 text-gray-400 hover:bg-gray-600'
                              }`}
                              title="Dislike this match"
                            >
                              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                <path d="M18 9.5a1.5 1.5 0 11-3 0v-6a1.5 1.5 0 013 0v6zM14 9.667v-5.894a2 2 0 00-1.106-1.79l-.05-.025A4 4 0 0011.057 2H5.64a2 2 0 00-1.962 1.608l-1.2 6A2 2 0 004.44 12H8v4a2 2 0 002 2 1 1 0 001-1v-.667a4 4 0 01.8-2.4l1.4-1.866a4 4 0 00.8-2.4z" />
                              </svg>
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </main>
      </div>

      {/* Dislike Reason Modal */}
      {showDislikeReason && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-900 rounded-lg max-w-md w-full p-6">
            <h3 className="text-xl font-bold text-white mb-4">Why did you dislike this match?</h3>
            <p className="text-gray-300 mb-4">
              Help us improve our matching algorithm by telling us why this job wasn't a good fit.
            </p>
            <textarea
              value={dislikeReason}
              onChange={(e) => setDislikeReason(e.target.value)}
              placeholder="Enter your reason (e.g., wrong skills, low budget, not interested in this type of work...)"
              className="w-full bg-gray-800 text-white border border-gray-600 rounded px-3 py-2 mb-4 focus:border-red-400 focus:outline-none resize-none"
              rows={4}
            />
            <div className="flex gap-4">
              <button
                onClick={handleDislikeReasonCancel}
                className="flex-1 bg-gray-700 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDislikeReasonSubmit(showDislikeReason)}
                disabled={!dislikeReason.trim()}
                className="flex-1 bg-red-400 text-black px-4 py-2 rounded-lg hover:bg-red-300 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Submit
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
