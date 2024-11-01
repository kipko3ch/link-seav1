'use client'
import React from 'react'

interface ColorPickerProps {
  label: string;
  value: string;
  onChange: (color: string) => void;
}

export default function ColorPicker({ label, value, onChange }: ColorPickerProps) {
  return (
    <div className="flex flex-col space-y-2">
      <label className="text-gray-700 font-medium">{label}</label>
      <div className="flex items-center space-x-3">
        <input
          type="color"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-12 h-12 rounded cursor-pointer"
        />
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="flex-1 p-2 border border-gray-300 rounded"
          placeholder="#000000"
        />
      </div>
    </div>
  )
} 