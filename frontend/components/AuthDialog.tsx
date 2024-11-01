'use client'
import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { Loader2 } from 'lucide-react'
import { loginUser, registerUser } from '@/utils/api'
import { useRouter } from 'next/navigation'

interface AuthDialogProps {
  isOpen: boolean
  onClose: () => void
  defaultTab?: 'login' | 'signup'
}

export default function AuthDialog({
  isOpen,
  onClose,
  defaultTab = 'login',
}: AuthDialogProps) {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState(defaultTab)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
  })

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')

    try {
      const response = await loginUser(formData.email, formData.password)
      localStorage.setItem('token', response.token)
      router.push('/dashboard')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login failed')
    } finally {
      setIsLoading(false)
    }
  }

  const handleSignup = async (e: React.FormEvent) => {
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
      router.push('/dashboard')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Registration failed')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-[#002b4d] text-[#E6F3F7] border border-[#004080] sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="text-[#00FFFF] text-center text-2xl">
            Welcome to Link Sea
          </DialogTitle>
        </DialogHeader>

        <Tabs defaultValue={activeTab} onValueChange={(v) => setActiveTab(v as 'login' | 'signup')}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="login">Login</TabsTrigger>
            <TabsTrigger value="signup">Sign Up</TabsTrigger>
          </TabsList>

          <AnimatePresence mode="wait">
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="bg-red-500/10 border border-red-500/50 text-red-500 px-4 py-3 rounded mt-4"
              >
                {error}
              </motion.div>
            )}
          </AnimatePresence>

          <TabsContent value="login">
            <form onSubmit={handleLogin} className="space-y-4 mt-4">
              <div>
                <Label htmlFor="email" className="text-[#A0D8EF]">
                  Email
                </Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  className="bg-[#001a2c] border-[#004080] text-[#E6F3F7] mt-1"
                  placeholder="you@example.com"
                  required
                />
              </div>
              <div>
                <Label htmlFor="password" className="text-[#A0D8EF]">
                  Password
                </Label>
                <Input
                  id="password"
                  type="password"
                  value={formData.password}
                  onChange={(e) =>
                    setFormData({ ...formData, password: e.target.value })
                  }
                  className="bg-[#001a2c] border-[#004080] text-[#E6F3F7] mt-1"
                  required
                />
              </div>
              <Button
                type="submit"
                disabled={isLoading}
                className="w-full bg-gradient-to-r from-[#00FFFF] to-[#FF00FF] text-[#001a2c] hover:opacity-90"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Logging in...
                  </>
                ) : (
                  'Login'
                )}
              </Button>
            </form>
          </TabsContent>

          <TabsContent value="signup">
            <form onSubmit={handleSignup} className="space-y-4 mt-4">
              <div>
                <Label htmlFor="username" className="text-[#A0D8EF]">
                  Username
                </Label>
                <Input
                  id="username"
                  type="text"
                  value={formData.username}
                  onChange={(e) =>
                    setFormData({ ...formData, username: e.target.value })
                  }
                  className="bg-[#001a2c] border-[#004080] text-[#E6F3F7] mt-1"
                  placeholder="johndoe"
                  required
                />
              </div>
              <div>
                <Label htmlFor="signup-email" className="text-[#A0D8EF]">
                  Email
                </Label>
                <Input
                  id="signup-email"
                  type="email"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  className="bg-[#001a2c] border-[#004080] text-[#E6F3F7] mt-1"
                  placeholder="you@example.com"
                  required
                />
              </div>
              <div>
                <Label htmlFor="signup-password" className="text-[#A0D8EF]">
                  Password
                </Label>
                <Input
                  id="signup-password"
                  type="password"
                  value={formData.password}
                  onChange={(e) =>
                    setFormData({ ...formData, password: e.target.value })
                  }
                  className="bg-[#001a2c] border-[#004080] text-[#E6F3F7] mt-1"
                  required
                />
              </div>
              <div>
                <Label htmlFor="confirm-password" className="text-[#A0D8EF]">
                  Confirm Password
                </Label>
                <Input
                  id="confirm-password"
                  type="password"
                  value={formData.confirmPassword}
                  onChange={(e) =>
                    setFormData({ ...formData, confirmPassword: e.target.value })
                  }
                  className="bg-[#001a2c] border-[#004080] text-[#E6F3F7] mt-1"
                  required
                />
              </div>
              <Button
                type="submit"
                disabled={isLoading}
                className="w-full bg-gradient-to-r from-[#00FFFF] to-[#FF00FF] text-[#001a2c] hover:opacity-90"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Creating account...
                  </>
                ) : (
                  'Sign Up'
                )}
              </Button>
            </form>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  )
} 