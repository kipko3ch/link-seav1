'use client'
import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Anchor, Loader2 } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { registerUser } from '@/utils/api'

export default function Signup() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: ''
  })
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match')
      setIsLoading(false)
      return
    }

    try {
      const response = await registerUser(
        formData.username,
        formData.email,
        formData.password
      )
      localStorage.setItem('token', response.token)
      localStorage.setItem('username', response.user.username)
      router.push('/dashboard')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Registration failed')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white">
      <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10"></div>
      
      <div className="container mx-auto min-h-screen flex flex-col items-center justify-center p-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md space-y-8"
        >
          <div className="flex items-center justify-center">
            <Anchor className="h-10 w-10 sm:h-12 sm:w-12 text-blue-400 mr-2" />
            <h1 className="text-2xl sm:text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-cyan-400">
              Link Sea
            </h1>
          </div>

          <div className="bg-gray-800/50 backdrop-blur-xl border border-gray-700/50 rounded-xl p-6 sm:p-8">
            <h2 className="text-xl sm:text-2xl font-bold text-blue-400 mb-6 text-center">
              Create Account
            </h2>

            <AnimatePresence mode="wait">
              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="bg-red-500/10 border border-red-500/50 text-red-500 px-4 py-3 rounded-lg mb-6 text-sm"
                >
                  {error}
                </motion.div>
              )}
            </AnimatePresence>

            <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
              <div>
                <Label htmlFor="username" className="text-sm font-medium">Username</Label>
                <Input
                  id="username"
                  type="text"
                  value={formData.username}
                  onChange={(e) =>
                    setFormData({ ...formData, username: e.target.value })
                  }
                  className="mt-1 bg-gray-900/50 border-gray-700 text-white"
                  placeholder="johndoe"
                  required
                  disabled={isLoading}
                />
              </div>

              <div>
                <Label htmlFor="email" className="text-sm font-medium">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  className="mt-1 bg-gray-900/50 border-gray-700 text-white"
                  placeholder="you@example.com"
                  required
                  disabled={isLoading}
                />
              </div>

              <div>
                <Label htmlFor="password" className="text-sm font-medium">Password</Label>
                <Input
                  id="password"
                  type="password"
                  value={formData.password}
                  onChange={(e) =>
                    setFormData({ ...formData, password: e.target.value })
                  }
                  className="mt-1 bg-gray-900/50 border-gray-700 text-white"
                  required
                  disabled={isLoading}
                />
              </div>

              <div>
                <Label htmlFor="confirmPassword" className="text-sm font-medium">Confirm Password</Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  value={formData.confirmPassword}
                  onChange={(e) =>
                    setFormData({ ...formData, confirmPassword: e.target.value })
                  }
                  className="mt-1 bg-gray-900/50 border-gray-700 text-white"
                  required
                  disabled={isLoading}
                />
              </div>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                disabled={isLoading}
                className={`w-full py-2.5 rounded-lg font-medium transition-all duration-200 ${
                  isLoading
                    ? 'bg-gray-700 cursor-not-allowed'
                    : 'bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600'
                }`}
              >
                {isLoading ? (
                  <div className="flex items-center justify-center">
                    <Loader2 className="animate-spin h-5 w-5 mr-2" />
                    Creating account...
                  </div>
                ) : (
                  'Sign Up'
                )}
              </motion.button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-sm text-gray-400">
                Already have an account?{' '}
                <Link
                  href="/login"
                  className="text-blue-400 hover:text-blue-300 transition-colors"
                >
                  Login
                </Link>
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
} 