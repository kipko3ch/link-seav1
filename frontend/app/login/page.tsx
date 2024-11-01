'use client'
import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Anchor, Waves, Loader2 } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { loginUser, requestPasswordReset, resetPassword } from '@/utils/api'

export default function Login() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  })
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [showResetModal, setShowResetModal] = useState(false);
  const [resetStep, setResetStep] = useState<'email' | 'verify'>('email');
  const [resetEmail, setResetEmail] = useState('');
  const [resetOTP, setResetOTP] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [resetLoading, setResetLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [focusedInput, setFocusedInput] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      console.log('Attempting login with:', formData.email);
      const response = await loginUser(formData.email, formData.password);
      console.log('Login response:', response);
      
      if (response.token && response.user.username) {
        // Store credentials
        localStorage.setItem('token', response.token);
        localStorage.setItem('username', response.user.username);
        
        // Use window.location.href with full URL
        const baseUrl = window.location.origin;
        window.location.href = `${baseUrl}/dashboard`;
      } else {
        throw new Error('Invalid login response');
      }
    } catch (err) {
      console.error('Login error:', err);
      setError(err instanceof Error ? err.message : 'Failed to login. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRequestOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    setResetLoading(true);
    setError('');
    
    try {
      const response = await requestPasswordReset(resetEmail);
      setSuccessMessage('OTP sent to your email');
      setResetStep('verify');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to send OTP');
    } finally {
      setResetLoading(false);
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setResetLoading(true);
    setError('');

    try {
      const response = await resetPassword(resetEmail, resetOTP, newPassword);
      setSuccessMessage('Password reset successful');
      setShowResetModal(false);
      // Reset all states
      setResetEmail('');
      setResetOTP('');
      setNewPassword('');
      setResetStep('email');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to reset password');
    } finally {
      setResetLoading(false);
    }
  };

  const ResetPasswordModal = () => (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="bg-gray-800/80 backdrop-blur-lg border border-gray-700/50 rounded-lg p-6 max-w-sm w-full"
      >
        <h3 className="text-xl font-bold text-blue-400 mb-4">
          {resetStep === 'email' ? 'Reset Password' : 'Enter OTP'}
        </h3>

        {error && (
          <div className="bg-red-500/10 border border-red-500/50 text-red-500 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        {successMessage && (
          <div className="bg-green-500/10 border border-green-500/50 text-green-500 px-4 py-3 rounded mb-4">
            {successMessage}
          </div>
        )}

        {resetStep === 'email' && (
          <form onSubmit={handleRequestOTP} className="space-y-4">
            <div>
              <Label>Email</Label>
              <Input
                type="email"
                value={resetEmail}
                onChange={(e) => setResetEmail(e.target.value)}
                onFocus={() => setFocusedInput('email')}
                className="bg-gray-900/50 border-gray-700 text-white mt-1 w-full"
                placeholder="Enter your email"
                required
                autoFocus
              />
            </div>
            <Button
              type="submit"
              disabled={resetLoading}
              className="w-full bg-blue-500 hover:bg-blue-600"
            >
              {resetLoading ? (
                <div className="flex items-center justify-center">
                  <Loader2 className="animate-spin h-5 w-5 mr-2" />
                  Sending OTP...
                </div>
              ) : (
                'Send OTP'
              )}
            </Button>
          </form>
        )}

        {resetStep === 'verify' && (
          <form onSubmit={handleResetPassword} className="space-y-4">
            <div>
              <Label>Enter OTP</Label>
              <Input
                type="text"
                value={resetOTP}
                onChange={(e) => setResetOTP(e.target.value)}
                onFocus={() => setFocusedInput('otp')}
                className="bg-gray-900/50 border-gray-700 text-white mt-1 w-full"
                placeholder="Enter OTP"
                required
                autoFocus={focusedInput === 'otp'}
                autoComplete="off"
              />
            </div>
            <div>
              <Label>New Password</Label>
              <Input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                onFocus={() => setFocusedInput('newPassword')}
                className="bg-gray-900/50 border-gray-700 text-white mt-1 w-full"
                placeholder="Enter new password"
                required
                autoFocus={focusedInput === 'newPassword'}
                autoComplete="new-password"
              />
            </div>
            <Button
              type="submit"
              disabled={resetLoading}
              className="w-full bg-blue-500 hover:bg-blue-600"
            >
              {resetLoading ? (
                <div className="flex items-center justify-center">
                  <Loader2 className="animate-spin h-5 w-5 mr-2" />
                  Resetting Password...
                </div>
              ) : (
                'Reset Password'
              )}
            </Button>
          </form>
        )}

        <div className="mt-4 flex justify-end">
          <Button
            variant="ghost"
            onClick={() => {
              setShowResetModal(false);
              setResetStep('email');
              setResetEmail('');
              setResetOTP('');
              setNewPassword('');
              setError('');
              setSuccessMessage('');
              setFocusedInput(null);
            }}
            className="text-gray-400 hover:text-gray-300"
          >
            Cancel
          </Button>
        </div>
      </motion.div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white">
      <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10"></div>
      
      <div className="container mx-auto min-h-screen flex flex-col items-center justify-center px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md"
        >
          <div className="flex items-center justify-center mb-8">
            <Anchor className="h-12 w-12 text-blue-400 mr-2" />
            <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-cyan-400">
              Link Sea
            </h1>
          </div>

          <div className="bg-gray-800/50 backdrop-blur-xl border border-gray-700/50 rounded-lg p-8">
            <h2 className="text-2xl font-bold text-blue-400 mb-6 text-center">
              Welcome Back
            </h2>

            <AnimatePresence mode="wait">
              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="bg-red-500/10 border border-red-500/50 text-red-500 px-4 py-3 rounded mb-6"
                >
                  {error}
                </motion.div>
              )}
            </AnimatePresence>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  className="bg-gray-900/50 border-gray-700 text-white mt-1"
                  placeholder="you@example.com"
                  required
                  disabled={isLoading}
                />
              </div>

              <div>
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  value={formData.password}
                  onChange={(e) =>
                    setFormData({ ...formData, password: e.target.value })
                  }
                  className="bg-gray-900/50 border-gray-700 text-white mt-1"
                  required
                  disabled={isLoading}
                />
              </div>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                disabled={isLoading}
                className={`w-full py-3 rounded-lg font-medium transition-all duration-200 ${
                  isLoading
                    ? 'bg-gray-700 cursor-not-allowed'
                    : 'bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600'
                }`}
              >
                {isLoading ? (
                  <div className="flex items-center justify-center">
                    <Loader2 className="animate-spin h-5 w-5 mr-2" />
                    Logging in...
                  </div>
                ) : (
                  'Login'
                )}
              </motion.button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-gray-400">
                Don't have an account?{' '}
                <Link
                  href="/signup"
                  className="text-blue-400 hover:text-blue-300 transition-colors"
                >
                  Sign up
                </Link>
              </p>
            </div>

            <div className="mt-4 text-center">
              <button
                type="button"
                onClick={() => setShowResetModal(true)}
                className="text-blue-400 hover:text-blue-300 text-sm"
              >
                Forgot Password?
              </button>
            </div>
          </div>
        </motion.div>
      </div>

      {showResetModal && <ResetPasswordModal />}
    </div>
  )
} 