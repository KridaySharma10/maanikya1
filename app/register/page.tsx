'use client'

import { useState } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { X } from 'lucide-react'
import { motion } from 'framer-motion'

export default function Register() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()
  const { signUp } = useAuth()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')
    try {
      await signUp(email, password, name)
      router.push('/')
    } catch (error) {
      setError('Failed to create an account. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-blue-100 p-4">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-blue-900/30 backdrop-blur-md w-full max-w-md p-8 rounded-2xl shadow-xl relative"
      >
        <Link href="/" className="absolute right-4 top-4 text-gray-400 hover:text-gray-600">
          <X className="w-6 h-6" />
        </Link>

        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Create Account</h1>
          <p className="text-gray-600">Join WatchX and start bidding</p>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-50 text-red-500 rounded-lg text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="name" className="form-label text-cyan-300">Name</label>
            <Input
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="form-input bg-blue-800/50 border-blue-600 text-cyan-100 placeholder-cyan-300/50"
              placeholder="Enter your name"
            />
          </div>
          <div>
            <label htmlFor="email" className="form-label text-cyan-300">Email</label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="form-input bg-blue-800/50 border-blue-600 text-cyan-100 placeholder-cyan-300/50"
              placeholder="Enter your email"
            />
          </div>
          <div>
            <label htmlFor="password" className="form-label text-cyan-300">Password</label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="form-input bg-blue-800/50 border-blue-600 text-cyan-100 placeholder-cyan-300/50"
              placeholder="Create a password"
            />
          </div>
          <Button type="submit" className="w-full btn btn-primary bg-blue-600 hover:bg-blue-700 text-cyan-100" disabled={isLoading}>
            {isLoading ? 'Creating Account...' : 'Create Account'}
          </Button>
        </form>
        <div className="mt-8 text-center text-gray-600">
          Already have an account? <Link href="/login" className="text-cyan-400 hover:text-cyan-300 font-medium">Sign In</Link>
        </div>
      </motion.div>
    </div>
  )
}

