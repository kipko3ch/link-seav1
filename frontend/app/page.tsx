'use client'
import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { 
  Anchor, 
  ChevronRight,
  Globe2, 
  BarChart3,
  Share2,
  Menu,
  X
} from 'lucide-react'
import { Button } from '@/components/ui/button'

export default function Home() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)

  // Handle scroll effect for navbar
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const features = [
    {
      icon: Globe2,
      title: "One Link for Everything",
      description: "Centralize all your social media profiles and important links in one stunning, customizable page.",
      gradient: "from-blue-500 to-cyan-500"
    },
    {
      icon: BarChart3,
      title: "Track Your Reach",
      description: "Get detailed analytics and insights about your audience engagement and link performance.",
      gradient: "from-purple-500 to-pink-500"
    },
    {
      icon: Share2,
      title: "Easy Sharing",
      description: "Share your Link Sea page effortlessly across all platforms with a single, memorable link.",
      gradient: "from-amber-500 to-orange-500"
    }
  ]

  return (
    <div className="min-h-screen bg-black text-white overflow-hidden font-['Inter']">
      {/* Background Effects */}
      <div className="fixed inset-0 z-0">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#4f4f4f2e_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f2e_1px,transparent_1px)] bg-[size:14px_24px] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_0%,#000_70%,transparent_110%)]"></div>
        <div className="absolute inset-0 bg-gradient-to-tr from-violet-500/10 via-fuchsia-500/10 to-cyan-500/10"></div>
      </div>

      {/* Navigation */}
      <header 
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled ? 'bg-black/80 backdrop-blur-md shadow-lg' : 'bg-transparent'
        }`}
      >
        <nav className="max-w-7xl mx-auto px-6">
          <div className="flex items-center justify-between h-20">
            {/* Logo */}
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex items-center space-x-2"
            >
              <Anchor className="h-8 w-8 text-blue-400" />
              <span className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-cyan-400">
                Link Sea
              </span>
            </motion.div>

            {/* Desktop Navigation */}
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="hidden md:flex items-center space-x-6"
            >
              <Link href="/login">
                <Button
                  variant="ghost"
                  className="text-gray-300 hover:text-white hover:bg-white/10 rounded-full px-6 py-2"
                >
                  Login
                </Button>
              </Link>
              <Link href="/signup">
                <Button
                  className="bg-white hover:bg-gray-100 text-black rounded-full px-6 py-2 font-medium"
                >
                  Get Started
                </Button>
              </Link>
            </motion.div>

            {/* Mobile Menu Button */}
            <motion.button
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="md:hidden p-2 hover:bg-white/10 rounded-lg transition-colors"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? (
                <X className="h-6 w-6 text-gray-300" />
              ) : (
                <Menu className="h-6 w-6 text-gray-300" />
              )}
            </motion.button>
          </div>

          {/* Mobile Menu */}
          <motion.div
            initial={false}
            animate={{
              height: isMenuOpen ? 'auto' : 0,
              opacity: isMenuOpen ? 1 : 0
            }}
            className={`md:hidden overflow-hidden transition-all duration-300 ${
              isMenuOpen ? 'border-t border-white/10' : ''
            }`}
          >
            <div className="py-4 space-y-4">
              <Link href="/login" className="block">
                <Button
                  variant="ghost"
                  className="w-full text-gray-300 hover:text-white hover:bg-white/10 justify-center"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Login
                </Button>
              </Link>
              <Link href="/signup" className="block">
                <Button
                  className="w-full bg-white hover:bg-gray-100 text-black justify-center"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Get Started
                </Button>
              </Link>
            </div>
          </motion.div>
        </nav>
      </header>

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center pt-20 pb-32 px-6">
        <div className="max-w-6xl mx-auto text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="space-y-8"
          >
            <motion.h1
              className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold leading-tight tracking-tight"
              animate={{ 
                backgroundPosition: ['0% center', '100% center'],
              }}
              transition={{
                duration: 8,
                repeat: Infinity,
                repeatType: "reverse"
              }}
              style={{
                backgroundImage: 'linear-gradient(to right, #60A5FA, #34D399, #60A5FA)',
                backgroundSize: '200% auto',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              Your Digital Identity<br />Simplified
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.8 }}
              className="text-lg sm:text-xl text-gray-400 max-w-3xl mx-auto px-4"
            >
              Create a stunning page that brings together all your important links in one place.
              Share your digital presence effortlessly and track your reach.
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="flex flex-col sm:flex-row items-center justify-center gap-4 px-4"
            >
              <Link href="/signup">
                <Button
                  className="group relative px-8 py-6 rounded-full overflow-hidden bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-lg font-medium transition-all duration-300 w-full sm:w-auto"
                >
                  <span className="relative z-10 flex items-center justify-center">
                    Get Started Free
                    <ChevronRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
                  </span>
                </Button>
              </Link>
            </motion.div>
          </motion.div>

          {/* Features Grid */}
          <div className="mt-32 grid grid-cols-1 md:grid-cols-3 gap-8 px-4">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.2 }}
                className="relative group"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-cyan-500/10 rounded-3xl blur-xl transition-all duration-500 group-hover:blur-2xl"></div>
                <div className="relative bg-black/40 backdrop-blur-xl border border-white/10 rounded-2xl p-8 hover:border-white/20 transition-all duration-300">
                  <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${feature.gradient} flex items-center justify-center mb-6`}>
                    <feature.icon className="h-6 w-6 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
                  <p className="text-gray-400 leading-relaxed">{feature.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Floating Elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <motion.div
            animate={{
              y: [0, -50, 0],
              rotate: [0, 180, 360],
            }}
            transition={{
              duration: 20,
              repeat: Infinity,
              ease: "linear"
            }}
            className="absolute top-1/4 left-1/4 w-72 h-72 bg-blue-500/30 rounded-full blur-[100px]"
          />
          <motion.div
            animate={{
              y: [0, 50, 0],
              rotate: [360, 180, 0],
            }}
            transition={{
              duration: 25,
              repeat: Infinity,
              ease: "linear"
            }}
            className="absolute bottom-1/4 right-1/4 w-72 h-72 bg-purple-500/30 rounded-full blur-[100px]"
          />
        </div>
      </section>
    </div>
  )
} 