'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'

interface User {
  id: string
  email: string
  name: string
  isApproved: boolean
}

interface NotificationSettings {
  emailNotifications: boolean
  telegramNotifications: boolean
  telegramChatId: string
}

interface SavedSettings {
  emailNotifications: boolean
  telegramNotifications: boolean
  telegramChatId: string
}

export default function NotificationsPage() {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [settings, setSettings] = useState<NotificationSettings>({
    emailNotifications: true,
    telegramNotifications: false,
    telegramChatId: ''
  })
  const [savedSettings, setSavedSettings] = useState<SavedSettings>({
    emailNotifications: true,
    telegramNotifications: false,
    telegramChatId: ''
  })
  const [isSaving, setIsSaving] = useState(false)
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false)
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

  // Load saved settings from localStorage on component mount
  useEffect(() => {
    const savedSettingsStr = localStorage.getItem('notificationSettings')
    if (savedSettingsStr) {
      try {
        const saved = JSON.parse(savedSettingsStr)
        setSettings(saved)
        setSavedSettings(saved)
      } catch (error) {
        console.error('Error loading saved settings:', error)
      }
    }
  }, [])

  // Track changes to detect unsaved modifications
  useEffect(() => {
    const hasChanges = 
      settings.emailNotifications !== savedSettings.emailNotifications ||
      settings.telegramNotifications !== savedSettings.telegramNotifications ||
      settings.telegramChatId !== savedSettings.telegramChatId
    
    setHasUnsavedChanges(hasChanges)
  }, [settings, savedSettings])

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' })
      router.push('/login')
    } catch (error) {
      console.error('Logout error:', error)
    }
  }

  const handleToggle = (setting: keyof NotificationSettings) => {
    if (setting === 'telegramChatId') return
    
    setSettings(prev => ({
      ...prev,
      [setting]: !prev[setting]
    }))
  }

  const handleChatIdChange = (value: string) => {
    setSettings(prev => ({
      ...prev,
      telegramChatId: value
    }))
  }

  const handleSave = async () => {
    setIsSaving(true)
    try {
      // Here you would typically make an API call to save the settings
      // For now, we'll simulate a save and update the saved state
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      // Update the saved settings to match current settings
      setSavedSettings({
        emailNotifications: settings.emailNotifications,
        telegramNotifications: settings.telegramNotifications,
        telegramChatId: settings.telegramChatId
      })
      
      // Store in localStorage for persistence across sessions
      localStorage.setItem('notificationSettings', JSON.stringify(settings))
      
      console.log('Settings saved:', settings)
    } catch (error) {
      console.error('Error saving settings:', error)
    } finally {
      setIsSaving(false)
    }
  }

  const handleReset = () => {
    // Reset to saved settings
    setSettings({
      emailNotifications: savedSettings.emailNotifications,
      telegramNotifications: savedSettings.telegramNotifications,
      telegramChatId: savedSettings.telegramChatId
    })
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
            <button
              onClick={() => router.push('/dashboard')}
              className="bg-gray-800 text-white px-4 py-2 rounded text-sm hover:bg-gray-700 transition-colors"
            >
              Dashboard
            </button>
            <button
              onClick={() => router.push('/profile')}
              className="bg-gray-800 text-white px-4 py-2 rounded text-sm hover:bg-gray-700 transition-colors"
            >
              Profile
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

      <div className="flex">
        {/* Sidebar */}
        <aside className="w-64 bg-gray-900 min-h-screen">
          <nav className="p-6">
            <ul className="space-y-4">
              <li>
                <button 
                  onClick={() => router.push('/dashboard')}
                  className="flex items-center space-x-3 w-full text-left text-gray-400 hover:text-white px-4 py-3 rounded-lg"
                >
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
                <button className="flex items-center space-x-3 w-full text-left text-green-400 bg-gray-800 px-4 py-3 rounded-lg">
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
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-6">
          <div className="max-w-4xl">
            <h1 className="text-4xl font-bold text-white mb-8">Notifications</h1>
            
            {/* Notifications Card */}
            <div className="bg-gray-900 rounded-lg p-8">
              {/* Email Notifications Section */}
              <div className="mb-8">
                <div className="flex items-center mb-6">
                  <svg className="w-6 h-6 text-green-400 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-5 5-5-5h5v-5a7.5 7.5 0 1 0-15 0v5h5l-5 5-5-5h5v-5a7.5 7.5 0 1 1 15 0v5z" />
                  </svg>
                  <h2 className="text-2xl font-semibold text-white">Notifications</h2>
                </div>

                <div className="space-y-6">
                  {/* Email Notifications */}
                  <div>
                    <h3 className="text-lg font-medium text-white mb-3">Email notifications about new jobs</h3>
                    <div className="flex items-center space-x-4">
                      <button
                        onClick={() => handleToggle('emailNotifications')}
                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                          settings.emailNotifications ? 'bg-green-400' : 'bg-gray-600'
                        }`}
                      >
                        <span
                          className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                            settings.emailNotifications ? 'translate-x-6' : 'translate-x-1'
                          }`}
                        />
                      </button>
                      <span className="text-gray-300">
                        Get notified when new jobs matching your criteria are found
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Telegram Bot Notifications Section */}
              <div>
                <div className="flex items-center mb-6">
                  <svg className="w-6 h-6 text-green-400 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                  </svg>
                  <h2 className="text-2xl font-semibold text-white">Telegram Bot Notifications</h2>
                </div>

                <div className="space-y-6">
                  {/* Setup Instructions */}
                  <div>
                    <h3 className="text-lg font-medium text-white mb-4">Setup Instructions:</h3>
                    <ol className="space-y-3 text-gray-300">
                      <li className="flex items-start">
                        <span className="text-green-400 font-bold mr-3">1.</span>
                        <span>
                          Download Telegram if you don't have: 
                          <a 
                            href="https://telegram.org" 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="text-green-400 hover:text-green-300 ml-1 underline"
                          >
                            https://telegram.org
                          </a>
                        </span>
                      </li>
                      <li className="flex items-start">
                        <span className="text-green-400 font-bold mr-3">2.</span>
                        <span>
                          Find the bot and click start: 
                          <a 
                            href="https://t.me/upworkparserbot" 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="text-green-400 hover:text-green-300 ml-1 underline"
                          >
                            t.me/upworkparserbot
                          </a>
                        </span>
                      </li>
                      <li className="flex items-start">
                        <span className="text-green-400 font-bold mr-3">3.</span>
                        <span>Copy chat ID from the bot</span>
                      </li>
                    </ol>
                  </div>

                  {/* Telegram Chat ID Input */}
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2">
                      Telegram Chat ID
                    </label>
                    <input
                      type="text"
                      value={settings.telegramChatId}
                      onChange={(e) => handleChatIdChange(e.target.value)}
                      placeholder="Enter your Telegram chat ID"
                      className="w-full max-w-md bg-gray-800 text-white border border-gray-600 rounded px-3 py-2 focus:border-green-400 focus:outline-none"
                    />
                  </div>

                  {/* Telegram Notifications Toggle */}
                  <div>
                    <h3 className="text-lg font-medium text-white mb-3">Enable Telegram notifications</h3>
                    <div className="flex items-center space-x-4">
                      <button
                        onClick={() => handleToggle('telegramNotifications')}
                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                          settings.telegramNotifications ? 'bg-green-400' : 'bg-gray-600'
                        }`}
                      >
                        <span
                          className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                            settings.telegramNotifications ? 'translate-x-6' : 'translate-x-1'
                          }`}
                        />
                      </button>
                      <span className="text-gray-300">
                        Get instant notifications via Telegram when new jobs are found
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Save Button */}
              <div className="mt-8 pt-6 border-t border-gray-700">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    {hasUnsavedChanges && (
                      <div className="flex items-center text-yellow-400 text-sm">
                        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                        </svg>
                        You have unsaved changes
                      </div>
                    )}
                  </div>
                  
                  <div className="flex space-x-4">
                    {hasUnsavedChanges && (
                      <button
                        onClick={handleReset}
                        className="bg-gray-700 text-white px-6 py-3 rounded-lg font-medium hover:bg-gray-600 transition-colors"
                      >
                        Reset
                      </button>
                    )}
                    <button
                      onClick={handleSave}
                      disabled={isSaving || !hasUnsavedChanges}
                      className={`px-8 py-3 rounded-lg font-medium transition-colors ${
                        hasUnsavedChanges
                          ? 'bg-green-400 text-black hover:bg-green-300'
                          : 'bg-gray-600 text-gray-400 cursor-not-allowed'
                      } disabled:opacity-50 disabled:cursor-not-allowed`}
                    >
                      {isSaving ? 'Saving...' : 'Save Settings'}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}
