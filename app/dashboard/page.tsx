'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'
import { Button } from '@/components/ui/button'

export default function Dashboard() {
  const { user, loading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login')
    }
  }, [user, loading, router])

  if (loading) return <div className="text-center py-8">Loading...</div>
  if (!user) return null

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Welcome, {user.displayName}!</h2>
        <p className="text-gray-600 mb-4">Here you can manage your bids and listings.</p>
        <div className="space-y-4">
          <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white">View My Bids</Button>
          <Button className="w-full bg-green-600 hover:bg-green-700 text-white">Create New Listing</Button>
        </div>
      </div>
    </div>
  )
}

