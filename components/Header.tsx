'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useAuth } from '@/contexts/AuthContext'
import { Search, User, LogOut, PlusCircle, Settings, Menu, X, Moon } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import Image from 'next/image'

export default function Header() {
  const [searchQuery, setSearchQuery] = useState('')
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const { user, loading, signOut } = useAuth()
  const router = useRouter()

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 0)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const handleLogout = async () => {
    try {
      await signOut()
      router.push('/login')
    } catch (error) {
      console.error('Failed to log out', error)
    }
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    router.push(`/search?q=${encodeURIComponent(searchQuery)}`)
  }

  return (
    <header 
      className={`sticky top-0 z-50 transition-all duration-300 ${
        isScrolled ? 'bg-gray-900 bg-opacity-90 backdrop-blur-sm shadow-lg' : 'bg-transparent'
      }`}
    >
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-24">
          <Link href="/" className="flex items-center space-x-4 group">
            <motion.div
              whileHover={{ rotate: 360 }}
              transition={{ duration: 0.5 }}
              className="relative w-12 h-12"
            >
              <Moon className="w-12 h-12 text-blue-300 group-hover:text-blue-400 transition-colors" />
            </motion.div>
            <span className="text-3xl font-bold text-blue-300 group-hover:text-blue-400 transition-colors">WatchX</span>
          </Link>

          <form onSubmit={handleSearch} className="hidden md:flex flex-1 max-w-xl mx-8">
            <div className="relative w-full">
              <Input
                type="text"
                placeholder="Search for watches..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 rounded-full border border-gray-700 bg-gray-800 text-white focus:ring-2 focus:ring-blue-500 transition-all hover:border-blue-400"
              />
              <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
            </div>
          </form>

          <div className="hidden md:flex items-center space-x-4">
            {!loading && (
              user ? (
                <>
                  <Button variant="ghost" className="text-white hover:text-blue-400 transition-colors" asChild>
                    <Link href="/add-product">
                      <PlusCircle className="mr-2 h-4 w-4" />
                      Add Product
                    </Link>
                  </Button>
                  <Button variant="ghost" className="text-white hover:text-blue-400 transition-colors" asChild>
                    <Link href="/admin">
                      <Settings className="mr-2 h-4 w-4" />
                      Admin
                    </Link>
                  </Button>
                  <Button variant="ghost" className="text-white hover:text-blue-400 transition-colors" asChild>
                    <Link href="/dashboard">
                      <User className="mr-2 h-4 w-4" />
                      {user.displayName || 'Account'}
                    </Link>
                  </Button>
                  <Button onClick={handleLogout} variant="ghost" className="text-white hover:text-blue-400 transition-colors">
                    <LogOut className="mr-2 h-4 w-4" />
                    Logout
                  </Button>
                </>
              ) : (
                <>
                  <Button variant="ghost" className="text-white hover:text-blue-400 transition-colors" asChild>
                    <Link href="/login">Sign In</Link>
                  </Button>
                  <Button className="bg-blue-600 text-white hover:bg-blue-700 transition-colors" asChild>
                    <Link href="/register">Create Account</Link>
                  </Button>
                </>
              )
            )}
          </div>

          <button
            className="md:hidden p-2 text-white hover:text-blue-400 transition-colors"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-gray-900 border-t border-gray-800"
          >
            <div className="container mx-auto px-4 py-4 space-y-4">
              <form onSubmit={handleSearch} className="relative">
                <Input
                  type="text"
                  placeholder="Search for watches..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 rounded-full border border-gray-700 bg-gray-800 text-white focus:ring-2 focus:ring-blue-500 transition-all hover:border-blue-400"
                />
                <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
              </form>

              {!loading && (
                user ? (
                  <div className="space-y-2">
                    <Button variant="ghost" className="w-full justify-start text-white hover:text-blue-400 transition-colors" asChild>
                      <Link href="/add-product">
                        <PlusCircle className="mr-2 h-4 w-4" />
                        Add Product
                      </Link>
                    </Button>
                    <Button variant="ghost" className="w-full justify-start text-white hover:text-blue-400 transition-colors" asChild>
                      <Link href="/admin">
                        <Settings className="mr-2 h-4 w-4" />
                        Admin
                      </Link>
                    </Button>
                    <Button variant="ghost" className="w-full justify-start text-white hover:text-blue-400 transition-colors" asChild>
                      <Link href="/dashboard">
                        <User className="mr-2 h-4 w-4" />
                        {user.displayName || 'Account'}
                      </Link>
                    </Button>
                    <Button
                      onClick={handleLogout}
                      variant="ghost"
                      className="w-full justify-start text-red-400 hover:text-red-300 transition-colors"
                    >
                      <LogOut className="mr-2 h-4 w-4" />
                      Logout
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <Button variant="ghost" className="w-full text-white hover:text-blue-400 transition-colors" asChild>
                      <Link href="/login">Sign In</Link>
                    </Button>
                    <Button className="w-full bg-blue-600 text-white hover:bg-blue-700 transition-colors" asChild>
                      <Link href="/register">Create Account</Link>
                    </Button>
                  </div>
                )
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}

