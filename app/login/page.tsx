'use client'

import { useState } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { X } from 'lucide-react'
import { motion } from 'framer-motion'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()
  const { signIn, resetPassword } = useAuth()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')
    try {
      await signIn(email, password)
      router.push('/')
    } catch (error) {
      setError('Invalid email or password')
    } finally {
      setIsLoading(false)
    }
  }

  const handleForgotPassword = async () => {
    if (!email) {
      setError('Please enter your email address')
      return
    }
    try {
      await resetPassword(email)
      alert('Password reset email sent! Check your inbox.')
    } catch (error) {
      setError('Failed to send reset email. Please try again.')
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 to-gray-800 p-4">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-blue-900/30 backdrop-blur-md w-full max-w-md p-8 rounded-2xl shadow-xl relative border border-blue-700"
      >
        <Link href="/" className="absolute right-4 top-4 text-gray-400 hover:text-gray-300">
          <X className="w-6 h-6" />
        </Link>

        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Welcome Back</h1>
          <p className="text-gray-300">Sign in to continue to WatchX</p>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-900/50 text-red-200 rounded-lg text-sm border border-red-800">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="email" className="form-label text-cyan-300">
              Email Address
            </label>
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
            <label htmlFor="password" className="form-label text-cyan-300">
              Password
            </label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="form-input bg-blue-800/50 border-blue-600 text-cyan-100 placeholder-cyan-300/50"
              placeholder="Enter your password"
            />
          </div>

          <Button
            type="submit"
            disabled={isLoading}
            className="w-full bg-blue-600 hover:bg-blue-700 text-cyan-100 transition-colors"
          >
            {isLoading ? 'Signing in...' : 'Sign In'}
          </Button>

          <button
            type="button"
            onClick={handleForgotPassword}
            className="w-full text-sm text-cyan-400 hover:text-cyan-300 transition-colors"
          >
            Forgot password?
          </button>
        </form>

        <div className="mt-8 text-center text-gray-400">
          Don't have an account?{' '}
          <Link href="/register" className="text-cyan-400 hover:text-cyan-300 font-medium">
            Create Account
          </Link>
        </div>
      </motion.div>
    </div>
  )
}

