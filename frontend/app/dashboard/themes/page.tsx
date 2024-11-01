'use client'
import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { getThemes, createTheme, updateTheme, deleteTheme } from '@/utils/api'
import type { Theme, CreateThemeData } from '@/types/theme'
import ColorPicker from '@/components/ColorPicker'

export default function ThemeCustomization() {
  const router = useRouter()
  const [themes, setThemes] = useState<Theme[]>([])
  const [isAddingTheme, setIsAddingTheme] = useState(false)
  const [error, setError] = useState('')
  const [newTheme, setNewTheme] = useState<CreateThemeData>({
    name: '',
    background_color: '#ffffff',
    text_color: '#000000',
    accent_color: '#0066cc'
  })

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (!token) {
      router.push('/login')
      return
    }

    fetchThemes()
  }, [router])

  const fetchThemes = async () => {
    try {
      const response = await getThemes()
      setThemes(response.themes)
    } catch (err) {
      setError('Failed to fetch themes')
    }
  }

  const handleAddTheme = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      await createTheme(newTheme)
      setIsAddingTheme(false)
      setNewTheme({
        name: '',
        background_color: '#ffffff',
        text_color: '#000000',
        accent_color: '#0066cc'
      })
      fetchThemes()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to add theme')
    }
  }

  const handleActivateTheme = async (id: number) => {
    try {
      await updateTheme(id, { is_active: true })
      fetchThemes()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to activate theme')
    }
  }

  const handleDeleteTheme = async (id: number) => {
    try {
      await deleteTheme(id)
      fetchThemes()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete theme')
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-900 via-blue-700 to-blue-500">
      <div className="container mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow-xl p-6">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold text-blue-900">Theme Customization</h1>
            <button
              onClick={() => setIsAddingTheme(true)}
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors"
            >
              Add New Theme
            </button>
          </div>

          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
              {error}
            </div>
          )}

          {isAddingTheme && (
            <form onSubmit={handleAddTheme} className="mb-8 space-y-4">
              <div>
                <label className="block text-gray-700 mb-2">Theme Name</label>
                <input
                  type="text"
                  value={newTheme.name}
                  onChange={(e) => setNewTheme({ ...newTheme, name: e.target.value })}
                  className="w-full p-2 border border-gray-300 rounded"
                  required
                />
              </div>
              <ColorPicker
                label="Background Color"
                value={newTheme.background_color}
                onChange={(color) => setNewTheme({ ...newTheme, background_color: color })}
              />
              <ColorPicker
                label="Text Color"
                value={newTheme.text_color}
                onChange={(color) => setNewTheme({ ...newTheme, text_color: color })}
              />
              <ColorPicker
                label="Accent Color"
                value={newTheme.accent_color}
                onChange={(color) => setNewTheme({ ...newTheme, accent_color: color })}
              />
              <div className="flex space-x-2">
                <button
                  type="submit"
                  className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors"
                >
                  Save Theme
                </button>
                <button
                  type="button"
                  onClick={() => setIsAddingTheme(false)}
                  className="bg-gray-300 text-gray-700 px-4 py-2 rounded hover:bg-gray-400 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </form>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {themes.map((theme) => (
              <div
                key={theme.id}
                className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                style={{
                  backgroundColor: theme.background_color,
                  color: theme.text_color
                }}
              >
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-xl font-semibold">{theme.name}</h3>
                  <div className="space-x-2">
                    {!theme.is_active && (
                      <button
                        onClick={() => handleActivateTheme(theme.id)}
                        className="text-sm px-3 py-1 rounded"
                        style={{ backgroundColor: theme.accent_color, color: theme.background_color }}
                      >
                        Activate
                      </button>
                    )}
                    <button
                      onClick={() => handleDeleteTheme(theme.id)}
                      className="text-red-600 hover:text-red-800"
                    >
                      Delete
                    </button>
                  </div>
                </div>
                <div className="space-y-2">
                  <div>Background: {theme.background_color}</div>
                  <div>Text: {theme.text_color}</div>
                  <div>Accent: {theme.accent_color}</div>
                </div>
                {theme.is_active && (
                  <div className="mt-2 text-sm font-medium" style={{ color: theme.accent_color }}>
                    Active Theme
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
} 