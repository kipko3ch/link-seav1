'use client'
import React, { useState, useEffect } from 'react'
import { getPublicPage, trackClick } from '@/utils/api'
import type { Link } from '@/types/link'
import { motion, AnimatePresence } from 'framer-motion'
import { Anchor, ExternalLink } from 'lucide-react'
import { socialIcons } from '@/components/SocialIconsGrid'
import { FaGlobe } from 'react-icons/fa'
import LoadingScreen from '@/components/LoadingScreen'

interface PageData {
  user: {
    id: number;
    username: string;
    email: string;
    bio: string;
  };
  links: Link[];
}

export default function PublicPage({ params }: { params: { username: string } }) {
  const [pageData, setPageData] = useState<PageData | null>(null)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchPageData = async () => {
      try {
        const data = await getPublicPage(params.username)
        setPageData(data)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load page')
      } finally {
        setLoading(false)
      }
    }

    fetchPageData()
  }, [params.username])

  if (loading) {
    return <LoadingScreen />;
  }

  if (error || !pageData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center">
        <div className="text-white text-xl">
          {error || 'Failed to load page'}
        </div>
      </div>
    )
  }

  const { user, links } = pageData

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white">
      <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10"></div>
      
      <div className="container mx-auto px-4 py-8 relative">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8 sm:mb-12"
        >
          <div className="flex flex-col items-center justify-center gap-4">
            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-gradient-to-br from-blue-500 to-cyan-400 flex items-center justify-center text-2xl sm:text-3xl font-bold text-white">
              {user.username?.slice(0, 2).toUpperCase()}
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-cyan-400">
              @{user.username}
            </h1>
            {user.bio && (
              <p className="text-gray-300 max-w-md text-center">
                {user.bio}
              </p>
            )}
          </div>
        </motion.div>

        <div className="max-w-md mx-auto space-y-4">
          <AnimatePresence mode="popLayout">
            {links.length > 0 ? (
              links.map((link, index) => {
                console.log('Link data:', link);
                console.log('Link type:', link.type);
                console.log('Available icons:', socialIcons.map(s => s.name));
                
                let socialIcon = socialIcons.find(s => s.name === link.type);
                
                if (!socialIcon) {
                  socialIcon = socialIcons.find(s => 
                    s.name.toLowerCase() === (link.type || '').toLowerCase()
                  );
                }
                
                console.log('Found social icon:', socialIcon);
                
                const IconComponent = socialIcon?.icon || FaGlobe;
                const iconColor = socialIcon?.color || '#4285F4';
                
                return (
                  <motion.a
                    key={link.id}
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => trackClick(link.id)}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ delay: index * 0.1 }}
                    className="block bg-gray-800/50 backdrop-blur-xl border border-gray-700/50 rounded-xl p-4 hover:scale-[1.02] transition-all duration-200"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="p-2 rounded-lg bg-gray-700/50">
                          <IconComponent 
                            size={24}
                            style={{ color: iconColor }}
                          />
                        </div>
                        <div>
                          <h2 className="font-semibold text-lg text-white">
                            {link.title}
                          </h2>
                          {link.description && (
                            <p className="text-sm text-gray-300">
                              {link.description}
                            </p>
                          )}
                        </div>
                      </div>
                      <ExternalLink className="w-5 h-5 text-gray-400" />
                    </div>
                  </motion.a>
                );
              })
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-12 bg-gray-800/50 backdrop-blur-xl border border-gray-700/50 rounded-xl"
              >
                <p className="text-gray-400">No links have been added yet.</p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <motion.footer
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="text-center mt-8 text-sm text-gray-400"
        >
          Powered by Link Sea
        </motion.footer>
      </div>
    </div>
  )
} 