'use client'
import { motion } from 'framer-motion'
import { Anchor } from 'lucide-react'

export default function LoadingScreen() {
  return (
    <div className="fixed inset-0 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center">
      <div className="relative">
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            rotate: [0, 360],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="relative bg-gray-900/80 backdrop-blur-xl rounded-full p-6 border border-gray-700/50"
        >
          <Anchor className="h-12 w-12 text-blue-400" />
        </motion.div>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="absolute -bottom-12 left-1/2 -translate-x-1/2 text-blue-400 font-medium"
        >
          Loading...
        </motion.div>
      </div>
    </div>
  )
} 