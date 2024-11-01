'use client'
import React, { useState, useEffect } from 'react'

interface ShareButtonProps {
  username: string;
}

export default function ShareButton({ username }: ShareButtonProps) {
  const [copied, setCopied] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const handleShare = async () => {
    const url = `${window.location.origin}/${username}`
    
    try {
      await navigator.clipboard.writeText(url)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error('Failed to copy URL:', err)
    }
  }

  if (!mounted) {
    return null // Don't render anything on the server side
  }

  return (
    <button
      onClick={handleShare}
      className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
        copied
          ? 'bg-green-500 text-white'
          : 'bg-blue-100 text-blue-900 hover:bg-blue-200'
      }`}
    >
      {copied ? 'Copied!' : 'Share Page'}
    </button>
  )
} 