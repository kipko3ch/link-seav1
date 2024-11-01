'use client'
import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import ShareButton from './ShareButton'
import { Menu, X } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

export default function DashboardNav() {
  const pathname = usePathname()
  const [username, setUsername] = useState<string | null>(null)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  useEffect(() => {
    setUsername(localStorage.getItem('username'))
  }, [])

  return (
    <nav className="bg-[#002b4d] shadow-md mb-6 relative z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <Link href="/" className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-[#00FFFF] to-[#FF00FF]">
              Link Sea
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-4">
            <Link
              href="/dashboard"
              className={`px-3 py-2 rounded-md text-sm font-medium ${
                pathname === '/dashboard'
                  ? 'bg-[#004080] text-[#00FFFF]'
                  : 'text-[#E6F3F7] hover:bg-[#003366]'
              }`}
            >
              My Links
            </Link>
            <Link
              href="/dashboard/themes"
              className={`px-3 py-2 rounded-md text-sm font-medium ${
                pathname === '/dashboard/themes'
                  ? 'bg-[#004080] text-[#00FFFF]'
                  : 'text-[#E6F3F7] hover:bg-[#003366]'
              }`}
            >
              Themes
            </Link>
            {username && <ShareButton username={username} />}
            <button
              onClick={() => {
                localStorage.removeItem('token')
                localStorage.removeItem('username')
                window.location.href = '/login'
              }}
              className="px-3 py-2 rounded-md text-sm font-medium text-red-400 hover:bg-red-500/10"
            >
              Logout
            </button>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden p-2 rounded-md text-[#E6F3F7] hover:bg-[#003366]"
          >
            {isMobileMenuOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-[#002b4d] border-t border-[#004080]"
          >
            <div className="px-4 py-3 space-y-2">
              <Link
                href="/dashboard"
                className={`block px-3 py-2 rounded-md text-sm font-medium ${
                  pathname === '/dashboard'
                    ? 'bg-[#004080] text-[#00FFFF]'
                    : 'text-[#E6F3F7] hover:bg-[#003366]'
                }`}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                My Links
              </Link>
              <Link
                href="/dashboard/themes"
                className={`block px-3 py-2 rounded-md text-sm font-medium ${
                  pathname === '/dashboard/themes'
                    ? 'bg-[#004080] text-[#00FFFF]'
                    : 'text-[#E6F3F7] hover:bg-[#003366]'
                }`}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Themes
              </Link>
              {username && (
                <div className="px-3 py-2">
                  <ShareButton username={username} />
                </div>
              )}
              <button
                onClick={() => {
                  localStorage.removeItem('token')
                  localStorage.removeItem('username')
                  window.location.href = '/login'
                }}
                className="w-full text-left px-3 py-2 rounded-md text-sm font-medium text-red-400 hover:bg-red-500/10"
              >
                Logout
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  )
} 