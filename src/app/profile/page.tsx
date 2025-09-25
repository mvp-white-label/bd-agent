'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'

interface User {
  id: string
  microsoft_id: string
  email: string
  name: string
  isApproved: boolean
  created_at: string
  updated_at: string
}

export default function ProfilePage() {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isEditing, setIsEditing] = useState(false)
  const [editForm, setEditForm] = useState({
    name: '',
    email: ''
  })
  const router = useRouter()

  useEffect(() => {
    const checkUserStatus = async () => {
      try {
        const response = await fetch('/api/auth/me')
        if (response.ok) {
          const data = await response.json()
          setUser(data.user)
          setEditForm({
            name: data.user.name,
            email: data.user.email
          })
          
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

  const handleEdit = () => {
    setIsEditing(true)
  }

  const handleCancel = () => {
    setIsEditing(false)
    setEditForm({
      name: user?.name || '',
      email: user?.email || ''
    })
  }

  const handleSave = async () => {
    try {
      // Here you would typically make an API call to update the user profile
      // For now, we'll just update the local state
      if (user) {
        setUser({
          ...user,
          name: editForm.name,
          email: editForm.email,
          updated_at: new Date().toISOString()
        })
      }
      setIsEditing(false)
    } catch (error) {
      console.error('Error updating profile:', error)
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
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
                    <button className="flex items-center space-x-3 w-full text-left text-green-400 bg-gray-800 px-4 py-3 rounded-lg">
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
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-5 5-5-5h5v-5a7.5 7.5 0 1 0-15 0v5h5l-5 5-5-5h5v-5a7.5 7.5 0 1 1 15 0v5z" />
                  </svg>
                  <span>Notifications</span>
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
          <div className="max-w-4xl mx-auto">
            <div className="flex justify-between items-center mb-8">
              <h1 className="text-3xl font-bold text-white">Profile</h1>
              {!isEditing && (
                <button
                  onClick={handleEdit}
                  className="bg-green-400 text-black px-6 py-2 rounded-lg font-medium hover:bg-green-300 transition-colors"
                >
                  Edit Profile
                </button>
              )}
            </div>

            {/* Profile Card */}
            <div className="bg-gray-900 rounded-lg p-8 mb-8">
              <div className="flex items-start space-x-6">
                {/* Avatar */}
                <div className="w-24 h-24 bg-gray-700 rounded-full flex items-center justify-center">
                  <span className="text-3xl font-bold text-white">
                    {user?.name?.charAt(0) || 'A'}
                  </span>
                </div>

                {/* Profile Info */}
                <div className="flex-1">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Basic Information */}
                    <div className="space-y-4">
                      <h3 className="text-xl font-semibold text-white mb-4">Basic Information</h3>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-400 mb-2">
                          Full Name
                        </label>
                        {isEditing ? (
                          <input
                            type="text"
                            value={editForm.name}
                            onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                            className="w-full bg-gray-800 text-white border border-gray-600 rounded px-3 py-2 focus:border-green-400 focus:outline-none"
                          />
                        ) : (
                          <p className="text-white text-lg">{user?.name}</p>
                        )}
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-400 mb-2">
                          Email Address
                        </label>
                        {isEditing ? (
                          <input
                            type="email"
                            value={editForm.email}
                            onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
                            className="w-full bg-gray-800 text-white border border-gray-600 rounded px-3 py-2 focus:border-green-400 focus:outline-none"
                          />
                        ) : (
                          <p className="text-white text-lg">{user?.email}</p>
                        )}
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-400 mb-2">
                          Account Status
                        </label>
                        <div className="flex items-center space-x-2">
                          <div className={`w-3 h-3 rounded-full ${user?.isApproved ? 'bg-green-400' : 'bg-red-400'}`}></div>
                          <span className={`text-lg ${user?.isApproved ? 'text-green-400' : 'text-red-400'}`}>
                            {user?.isApproved ? 'Approved' : 'Pending Approval'}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Account Details */}
                    <div className="space-y-4">
                      <h3 className="text-xl font-semibold text-white mb-4">Account Details</h3>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-400 mb-2">
                          Microsoft ID
                        </label>
                        <p className="text-gray-300 text-sm font-mono break-all">{user?.microsoft_id}</p>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-400 mb-2">
                          User ID
                        </label>
                        <p className="text-gray-300 text-sm font-mono">{user?.id}</p>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-400 mb-2">
                          Member Since
                        </label>
                        <p className="text-white">{user?.created_at ? formatDate(user.created_at) : 'N/A'}</p>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-400 mb-2">
                          Last Updated
                        </label>
                        <p className="text-white">{user?.updated_at ? formatDate(user.updated_at) : 'N/A'}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Activity Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="bg-gray-900 rounded-lg p-6">
                <div className="text-3xl font-bold text-green-400 mb-2">77</div>
                <div className="text-gray-400 text-sm">Total Jobs Viewed</div>
              </div>
              <div className="bg-gray-900 rounded-lg p-6">
                <div className="text-3xl font-bold text-green-400 mb-2">18</div>
                <div className="text-gray-400 text-sm">Jobs Applied To</div>
              </div>
              <div className="bg-gray-900 rounded-lg p-6">
                <div className="text-3xl font-bold text-green-400 mb-2">5</div>
                <div className="text-gray-400 text-sm">Successful Matches</div>
              </div>
            </div>

            {/* Edit Actions */}
            {isEditing && (
              <div className="flex justify-end space-x-4">
                <button
                  onClick={handleCancel}
                  className="bg-gray-700 text-white px-6 py-2 rounded-lg font-medium hover:bg-gray-600 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSave}
                  className="bg-green-400 text-black px-6 py-2 rounded-lg font-medium hover:bg-green-300 transition-colors"
                >
                  Save Changes
                </button>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  )
}

