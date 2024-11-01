'use client'
import React from 'react'
import { motion } from 'framer-motion'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'

const culturalThemes = [
  {
    name: "Japanese",
    icon: "🎌",
    gradient: "from-red-600 to-pink-500",
    pattern: "circles"
  },
  {
    name: "Nordic",
    icon: "⚔️",
    gradient: "from-blue-900 to-indigo-700",
    pattern: "lines"
  },
  {
    name: "Maori",
    icon: "🌿",
    gradient: "from-green-700 to-teal-600",
    pattern: "dots"
  },
  {
    name: "African",
    icon: "🌍",
    gradient: "from-yellow-600 to-red-600",
    pattern: "triangles"
  },
  {
    name: "Indian",
    icon: "🕉️",
    gradient: "from-orange-500 to-pink-500",
    pattern: "waves"
  },
  {
    name: "Arabic",
    icon: "☪️",
    gradient: "from-emerald-600 to-teal-500",
    pattern: "geometric"
  }
]

interface CulturalThemeSelectorProps {
  value: string;
  onChange: (value: string) => void;
}

export default function CulturalThemeSelector({ value, onChange }: CulturalThemeSelectorProps) {
  return (
    <RadioGroup value={value} onValueChange={onChange} className="grid grid-cols-3 gap-4">
      {culturalThemes.map((theme) => (
        <div key={theme.name} className="relative">
          <RadioGroupItem value={theme.name} id={theme.name} className="sr-only" />
          <motion.label
            htmlFor={theme.name}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className={`flex flex-col items-center justify-center p-4 rounded-xl cursor-pointer transition-all bg-gradient-to-br ${theme.gradient} ${
              value === theme.name
                ? 'ring-2 ring-blue-500 shadow-lg scale-105'
                : 'hover:shadow-md'
            }`}
          >
            <span className="text-3xl mb-2">{theme.icon}</span>
            <span className="text-sm font-medium text-white">{theme.name}</span>
          </motion.label>
        </div>
      ))}
    </RadioGroup>
  )
}
 