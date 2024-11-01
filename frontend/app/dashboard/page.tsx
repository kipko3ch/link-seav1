'use client'
import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { 
  Home, 
  Link as LinkIcon, 
  BarChart, 
  Settings,
  LogOut,
  Sun,
  Moon,
  Plus,
  ExternalLink,
  Trash2,
  Eye,
  TrendingUp,
  Copy,
  Loader2,
  Globe2,
} from 'lucide-react'
import { 
  FaFacebook,
  FaTwitter,
  FaInstagram,
  FaLinkedin,
  FaGithub,
  FaYoutube,
  FaTiktok,
  FaDiscord,
  FaTwitch,
  FaReddit,
  FaPinterest,
  FaWhatsapp,
  FaTelegram,
  FaMedium,
  FaPatreon,
  FaEnvelope,
  FaGlobe,
  FaHome,
  FaLink,
  FaChartBar,
  FaCog,
  FaSun,
  FaMoon
} from 'react-icons/fa'
import type { Link } from '@/types/link'
import { getUserLinks, createLink, deleteLink, updateProfile, updatePassword, getUserProfile } from '@/utils/api'
import { Toast } from '@/components/ui/toast'
import LoadingScreen from '@/components/LoadingScreen'

// Navigation items configuration
const navigationItems = [
  { icon: FaHome, id: "home", label: "Overview" },
  { icon: FaLink, id: "links", label: "Links" },
  { icon: FaChartBar, id: "stats", label: "Analytics" },
  { icon: FaCog, id: "settings", label: "Settings" },
]

// Add social icons configuration
const socialIcons = [
  { name: 'Facebook', icon: FaFacebook, color: '#1877F2' },
  { name: 'Twitter', icon: FaTwitter, color: '#1DA1F2' },
  { name: 'Instagram', icon: FaInstagram, color: '#E4405F' },
  { name: 'LinkedIn', icon: FaLinkedin, color: '#0A66C2' },
  { name: 'GitHub', icon: FaGithub, color: '#181717' },
  { name: 'YouTube', icon: FaYoutube, color: '#FF0000' },
  { name: 'TikTok', icon: FaTiktok, color: '#000000' },
  { name: 'Discord', icon: FaDiscord, color: '#5865F2' },
  { name: 'Twitch', icon: FaTwitch, color: '#9146FF' },
  { name: 'Reddit', icon: FaReddit, color: '#FF4500' },
  { name: 'Pinterest', icon: FaPinterest, color: '#E60023' },
  { name: 'WhatsApp', icon: FaWhatsapp, color: '#25D366' },
  { name: 'Telegram', icon: FaTelegram, color: '#26A5E4' },
  { name: 'Medium', icon: FaMedium, color: '#000000' },
  { name: 'Patreon', icon: FaPatreon, color: '#FF424D' },
  { name: 'Email', icon: FaEnvelope, color: '#EA4335' },
  { name: 'Website', icon: FaGlobe, color: '#4285F4' },
]

// Add dynamic export
export const dynamic = 'force-dynamic'

const DeleteConfirmationModal = ({ 
  isOpen, 
  linkTitle, 
  onConfirm, 
  onCancel,
  isDeleting 
}: { 
  isOpen: boolean;
  linkTitle: string;
  onConfirm: () => void;
  onCancel: () => void;
  isDeleting: boolean;
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50" onClick={(e) => {
      // Close modal when clicking backdrop
      if (e.target === e.currentTarget && !isDeleting) {
        onCancel();
      }
    }}>
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="bg-gray-800/80 backdrop-blur-lg border border-gray-700/50 rounded-lg p-6 w-full max-w-sm mx-4"
        onClick={e => e.stopPropagation()} // Prevent clicks from reaching backdrop
      >
        <h3 className="text-xl font-bold text-white mb-4">Delete Link</h3>
        <p className="text-gray-300 mb-6">
          Are you sure you want to delete "{linkTitle}"? This action cannot be undone.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 sm:justify-end">
          <Button
            variant="ghost"
            onClick={onCancel}
            disabled={isDeleting}
            className="w-full sm:w-auto text-gray-300 hover:text-white hover:bg-gray-700"
          >
            Cancel
          </Button>
          <Button
            onClick={() => {
              if (!isDeleting) {
                onConfirm();
              }
            }}
            disabled={isDeleting}
            className="w-full sm:w-auto bg-red-500 hover:bg-red-600 text-white"
          >
            {isDeleting ? (
              <div className="flex items-center justify-center">
                <Loader2 className="animate-spin h-5 w-5 mr-2" />
                Deleting...
              </div>
            ) : (
              'Delete'
            )}
          </Button>
        </div>
      </motion.div>
    </div>
  );
};

export default function Dashboard() {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState("home")
  const [darkMode, setDarkMode] = useState(true)
  const [username, setUsername] = useState('')
  const [newLinkName, setNewLinkName] = useState("")
  const [newLinkUrl, setNewLinkUrl] = useState("")
  const [newLinkType, setNewLinkType] = useState("")
  const [links, setLinks] = useState<Link[]>([])
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(true)
  const [successMessage, setSuccessMessage] = useState('')
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [linkToDelete, setLinkToDelete] = useState<Link | null>(null)
  const [deletingLinkId, setDeletingLinkId] = useState<number | null>(null);
  const [bio, setBio] = useState('')
  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [toasts, setToasts] = useState<Array<{ id: string; message: string; type: 'success' | 'error' | 'loading' }>>([]);
  const [isPasswordLoading, setIsPasswordLoading] = useState(false);
  const [passwordError, setPasswordError] = useState('');
  const [passwordSuccess, setPasswordSuccess] = useState('');

  // Load dark mode preference from localStorage
  useEffect(() => {
    const savedDarkMode = localStorage.getItem('darkMode')
    if (savedDarkMode !== null) {
      setDarkMode(JSON.parse(savedDarkMode))
    }
  }, [])

  // Save dark mode preference
  const toggleDarkMode = () => {
    const newDarkMode = !darkMode
    setDarkMode(newDarkMode)
    localStorage.setItem('darkMode', JSON.stringify(newDarkMode))
  }

  const fetchLinks = async () => {
    try {
      setIsLoading(true)
      const response = await getUserLinks()
      console.log('Fetched links response:', response); // Debug log
      if (response && response.links) {
        setLinks(response.links)
      }
    } catch (err) {
      console.error('Error fetching links:', err)
      setError(err instanceof Error ? err.message : 'Failed to fetch links')
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem('token')
      const storedUsername = localStorage.getItem('username')
      
      if (!token) {
        router.push('/login')
      } else {
        setUsername(storedUsername || '')
        await fetchLinks() // Fetch links after authentication check
      }
    }

    checkAuth()
  }, [router])

  const stats = [
    { 
      label: "Total Views", 
      value: links.reduce((sum, link) => sum + (link.click_count || 0), 0), 
      icon: Eye, 
      color: darkMode ? "text-blue-400" : "text-blue-600",
      bgColor: darkMode ? "bg-blue-400/10" : "bg-blue-100" 
    },
    { 
      label: "Total Links", 
      value: links.length, 
      icon: LinkIcon, 
      color: darkMode ? "text-blue-400" : "text-blue-600",
      bgColor: darkMode ? "bg-blue-400/10" : "bg-blue-100"
    },
    { 
      label: "Avg. Click Rate", 
      value: links.length ? 
        `${(links.reduce((sum, link) => sum + (link.click_count || 0), 0) / links.length).toFixed(1)}` 
        : "0", 
      icon: TrendingUp, 
      color: darkMode ? "text-green-400" : "text-green-600",
      bgColor: darkMode ? "bg-green-400/10" : "bg-green-100"
    },
  ]

  const handleNewLink = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setSuccessMessage('')
    
    try {
      setIsLoading(true)
      console.log('Creating new link with:', { 
        title: newLinkName,
        url: newLinkUrl,
        type: newLinkType 
      });
      
      if (!newLinkType) {
        setError('Please select a platform');
        return;
      }
      
      await createLink({
        title: newLinkName,
        url: newLinkUrl,
        type: newLinkType,
        description: ''
      });
      
      await fetchLinks(); // Fetch updated links after creating new one
      
      setNewLinkName("")
      setNewLinkUrl("")
      setNewLinkType("")
      setSuccessMessage('Link added successfully!')
      setTimeout(() => setSuccessMessage(''), 3000)
    } catch (err) {
      console.error('Error creating link:', err);
      setError(err instanceof Error ? err.message : 'Failed to create link')
    } finally {
      setIsLoading(false)
    }
  };

  const handleDeleteLink = async (link: Link) => {
    try {
      setDeletingLinkId(link.id);
      setError('');
      
      console.log('Attempting to delete link:', link.id);
      
      // Remove from UI immediately
      setLinks(prevLinks => prevLinks.filter(l => l.id !== link.id));
      
      // Close the modal
      setShowDeleteConfirm(false);
      setLinkToDelete(null);
      
      // Attempt backend deletion
      const response = await deleteLink(link.id);
      console.log('Delete response:', response);
      
      if (response.success) {
        // Show success message
        setSuccessMessage('Link deleted successfully');
        showToast('Link deleted successfully', 'success');
      } else {
        throw new Error(response.message || 'Failed to delete link');
      }
      
    } catch (err) {
      console.error('Failed to delete link:', err);
      // Refresh the links list to restore the link if deletion failed
      await fetchLinks();
      setError('Failed to delete link. Please try again.');
      showToast('Failed to delete link', 'error');
    } finally {
      setDeletingLinkId(null);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('username')
    router.push('/login')
  }

  const handleTabChange = (tab: string) => {
    setActiveTab(tab)
    setError('')
    setSuccessMessage('')
  }

  const handleUsernameChange = async () => {
    try {
      setIsLoading(true);
      setError('');

      if (!username.trim()) {
        setError('Username cannot be empty');
        return;
      }

      await updateProfile({ username });
      localStorage.setItem('username', username);
      setSuccessMessage('Username updated successfully!');
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (err) {
      console.error('Username update error:', err);
      setError(err instanceof Error ? err.message : 'Failed to update username');
    } finally {
      setIsLoading(false);
    }
  };

  const handleBioChange = async () => {
    const toastId = showToast('Saving bio...', 'loading');
    try {
      await updateProfile({ bio });
      removeToast(toastId);
      showToast('Bio updated successfully!', 'success');
    } catch (err) {
      removeToast(toastId);
      showToast(err instanceof Error ? err.message : 'Failed to update bio', 'error');
    }
  };

  const handlePasswordChange = async () => {
    try {
      setIsPasswordLoading(true);
      setPasswordError('');
      setPasswordSuccess('');
      
      // Validate password fields
      if (!currentPassword) {
        setPasswordError('Please enter your current password');
        return;
      }
      
      if (!newPassword || !confirmPassword) {
        setPasswordError('Please fill in all password fields');
        return;
      }

      if (newPassword.length < 6) {
        setPasswordError('New password must be at least 6 characters long');
        return;
      }

      if (newPassword !== confirmPassword) {
        setPasswordError('New passwords do not match');
        return;
      }

      await updatePassword(currentPassword, newPassword);
      
      // Clear form fields
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      
      // Show success message
      setPasswordSuccess('Password updated successfully!');
      setTimeout(() => setPasswordSuccess(''), 3000);
      
    } catch (err) {
      console.error('Password update error:', err);
      if (err instanceof Error) {
        setPasswordError(err.message.includes('incorrect') 
          ? 'Current password is incorrect. Please try again.'
          : 'Failed to update password. Please try again.'
        );
      }
    } finally {
      setIsPasswordLoading(false);
    }
  };

  const handleDeleteAccount = async () => {
    try {
      // Add API call to delete account
      router.push('/login')
    } catch (err) {
      setError('Failed to delete account')
    }
  }

  const renderContent = () => {
    switch (activeTab) {
      case 'home':
        return (
          <div className="space-y-4">
            {/* Welcome Section */}
            <Card className={darkMode ? 'bg-gray-800' : 'bg-white'}>
              <CardContent className="pt-6">
                <div className="flex flex-col gap-4">
                  {/* User Info */}
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-cyan-400 flex items-center justify-center text-lg font-bold text-gray-900">
                      {username?.slice(0, 2).toUpperCase()}
                    </div>
                    <div>
                      <h2 className="text-xl sm:text-2xl font-bold">Welcome back, {username}!</h2>
                    </div>
                  </div>

                  {/* Link Sea URL Section */}
                  <div className="flex flex-col gap-4 p-4 rounded-lg bg-gradient-to-r from-gray-800/50 to-gray-900/50 backdrop-blur-sm border border-gray-700/50">
                    <div className="flex flex-col gap-3">
                      <span className="text-gray-400 text-sm font-medium">
                        Your Link Sea page
                      </span>
                      <div className="flex flex-col sm:flex-row gap-3">
                        <div className="flex-1 flex flex-col gap-2">
                          <div className="flex items-center gap-2 p-3 bg-gray-900/50 rounded-lg border border-gray-700/30 overflow-x-auto">
                            <Globe2 className="h-4 w-4 text-blue-400 shrink-0" />
                            <code className="text-sm font-mono text-blue-400 whitespace-nowrap">
                              {window.location.origin}/{username}
                            </code>
                          </div>
                          <div className="flex gap-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              className="flex-1 h-10 hover:bg-gray-800/50 hover:text-blue-400 transition-colors"
                              onClick={() => {
                                const url = `${window.location.origin}/${username}`;
                                navigator.clipboard.writeText(url);
                                showToast('Link copied to clipboard!', 'success');
                              }}
                            >
                              <Copy className="h-4 w-4 mr-2" />
                              Copy Link
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="flex-1 h-10 hover:bg-gray-800/50 hover:text-blue-400 transition-colors"
                              onClick={() => window.open(`${window.location.origin}/${username}`, '_blank')}
                            >
                              <ExternalLink className="h-4 w-4 mr-2" />
                              Open Page
                            </Button>
                          </div>
                        </div>
                        <Button 
                          className="h-10 bg-blue-500 hover:bg-blue-600 text-white gap-2"
                          onClick={() => handleTabChange('links')}
                        >
                          <Plus className="h-4 w-4" /> Add Link
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Quick Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {stats.map((stat, index) => (
                <motion.div
                  key={stat.label}
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                >
                  <Card className={`${
                    darkMode 
                      ? 'bg-gray-800/30 backdrop-blur-lg border-gray-700/50 text-white' 
                      : 'bg-white text-black'
                  } shadow-lg hover:shadow-xl transition-all duration-300`}>
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className={`text-sm ${darkMode ? 'text-white/70' : 'text-black'}`}>
                            {stat.label}
                          </p>
                          <p className={`text-2xl font-bold mt-1 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                            {stat.value}
                          </p>
                        </div>
                        <div className={`p-3 rounded-lg ${stat.bgColor}`}>
                          <stat.icon className={`h-6 w-6 ${stat.color}`} />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>

            {/* Recent Links */}
            <Card className={darkMode ? 'bg-gray-800/40' : 'bg-white'}>
              <CardHeader>
                <CardTitle className="flex items-center justify-between text-base sm:text-lg">
                  <span>Your Links</span>
                  <span className="text-sm font-normal text-gray-500">
                    {links.length} {links.length === 1 ? 'link' : 'links'}
                  </span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {links.length > 0 ? (
                    links.slice(0, 5).map((link) => {
                      const socialIcon = socialIcons.find(s => s.name === link.type)
                      const IconComponent = socialIcon?.icon || FaGlobe
                      
                      return (
                        <motion.div
                          key={link.id}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          className={`flex items-center justify-between p-3 rounded-lg ${
                            darkMode 
                              ? 'bg-gray-700/50 hover:bg-gray-700' 
                              : 'bg-white hover:bg-white text-black'
                          } transition-all duration-200`}
                        >
                          <div className="flex items-center gap-3">
                            <div className={`p-2 rounded-lg ${darkMode ? 'bg-gray-600/50' : 'bg-white'}`}>
                              <IconComponent 
                                size={20}
                                style={{ color: socialIcon?.color }}
                              />
                            </div>
                            <div>
                              <h3 className={`font-medium text-sm sm:text-base ${darkMode ? 'text-white' : 'text-black'}`}>
                                {link.title}
                              </h3>
                              <p className={`text-xs sm:text-sm truncate max-w-[200px] sm:max-w-[300px] ${darkMode ? 'text-white/70' : 'text-black'}`}>
                                {link.url}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className={`text-sm ${darkMode ? 'text-blue-400' : 'text-blue-600'}`}>
                              {link.click_count || 0} clicks
                            </span>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => window.open(link.url, '_blank')}
                              className="h-8 w-8 p-0"
                              disabled={isLoading}
                            >
                              {isLoading ? (
                                <Loader2 className="h-4 w-4 animate-spin" />
                              ) : (
                                <ExternalLink className="h-4 w-4" />
                              )}
                            </Button>
                          </div>
                        </motion.div>
                      )
                    })
                  ) : (
                    <div className="text-center py-8">
                      <LinkIcon className="h-12 w-12 mx-auto mb-4 opacity-50" />
                      <p className="text-gray-400">
                        No links added yet. Add your first link above!
                      </p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        );

      case 'links':
        return (
          <div className="space-y-6 max-w-4xl mx-auto">
            {/* Add New Link Card */}
            <Card className="bg-gray-800/30 backdrop-blur-xl border border-gray-700/50 shadow-xl">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-xl">
                  <Plus className="h-6 w-6 text-blue-400" />
                  Add New Link
                </CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleNewLink} className="space-y-8">
                  {/* Platform Selection */}
                  <div className="space-y-3">
                    <Label className="text-lg font-semibold text-blue-400">
                      Choose Platform
                    </Label>
                    <div className="bg-gray-900/50 rounded-xl p-4">
                      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 max-h-[300px] overflow-y-auto pr-2 scrollbar-thin">
                        {socialIcons.map((social) => (
                          <button
                            key={social.name}
                            type="button"
                            onClick={() => setNewLinkType(social.name)}
                            className={`flex items-center gap-3 p-3 rounded-xl transition-all ${
                              newLinkType === social.name 
                                ? 'bg-blue-500/20 ring-2 ring-blue-400 shadow-lg' 
                                : 'bg-gray-800/50 hover:bg-gray-700/50 hover:scale-105'
                            }`}
                          >
                            <social.icon 
                              size={24}
                              style={{ color: social.color }}
                            />
                            <span className="text-sm font-medium">{social.name}</span>
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Link Details */}
                  <div className="grid sm:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label className="text-lg font-semibold text-blue-400">
                        Link Name
                      </Label>
                      <Input
                        value={newLinkName}
                        onChange={(e) => setNewLinkName(e.target.value)}
                        className="bg-gray-900/50 border-gray-700 text-white"
                        placeholder="e.g., My Instagram"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-lg font-semibold text-blue-400">
                        URL
                      </Label>
                      <div className="relative">
                        <Input
                          value={newLinkUrl}
                          onChange={(e) => setNewLinkUrl(e.target.value)}
                          className="bg-gray-900/50 border-gray-700 text-white pl-10"
                          placeholder="https://example.com/myprofile"
                          required
                        />
                        <FaGlobe className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                      </div>
                    </div>
                  </div>

                  <Button 
                    type="submit" 
                    className="w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-medium py-2.5 rounded-xl"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <div className="flex items-center justify-center">
                        <Loader2 className="animate-spin h-5 w-5 mr-2" />
                        Adding Link...
                      </div>
                    ) : (
                      <div className="flex items-center justify-center">
                        <Plus className="h-5 w-5 mr-2" /> Add Link
                      </div>
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>

            {/* Links List */}
            <Card className="bg-gray-800/30 backdrop-blur-xl border border-gray-700/50 shadow-xl">
              <CardHeader>
                <CardTitle className="flex items-center justify-between text-xl">
                  <span>Your Links</span>
                  <span className="text-sm font-normal text-gray-400">
                    {links.length} {links.length === 1 ? 'link' : 'links'}
                  </span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {links.length > 0 ? (
                    links.map((link) => {
                      const socialIcon = socialIcons.find(s => s.name === link.type)
                      const IconComponent = socialIcon?.icon || FaGlobe
                      
                      return (
                        <motion.div
                          key={link.id}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 rounded-xl bg-gray-900/50 hover:bg-gray-800/50 transition-all group gap-4"
                        >
                          <div className="flex items-center gap-4 w-full sm:w-auto">
                            <div className="p-3 rounded-xl bg-gray-800/50 group-hover:bg-gray-700/50 shrink-0">
                              <IconComponent 
                                size={24}
                                style={{ color: socialIcon?.color }}
                              />
                            </div>
                            <div className="min-w-0 flex-1">
                              <h3 className="font-medium text-lg truncate">
                                {link.title}
                              </h3>
                              <p className="text-sm text-gray-400 truncate">
                                {link.url}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
                            <span className="text-sm text-blue-400 mr-2">
                              {link.click_count || 0} clicks
                            </span>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => window.open(link.url, '_blank')}
                              className="hover:bg-gray-700/50 rounded-lg"
                            >
                              <ExternalLink className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => {
                                if (!showDeleteConfirm) {  // Only set if not already showing
                                  setLinkToDelete(link);
                                  setShowDeleteConfirm(true);
                                }
                              }}
                              className="text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-lg"
                              disabled={deletingLinkId === link.id}
                            >
                              {deletingLinkId === link.id ? (
                                <Loader2 className="h-4 w-4 animate-spin" />
                              ) : (
                                <Trash2 className="h-4 w-4" />
                              )}
                            </Button>
                          </div>
                        </motion.div>
                      )
                    })
                  ) : (
                    <div className="text-center py-12">
                      <LinkIcon className="h-12 w-12 mx-auto mb-4 text-gray-500 opacity-50" />
                      <p className="text-gray-400">
                        No links added yet. Add your first link above!
                      </p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        );

      case 'stats':
        return (
          <Card className={darkMode ? 'bg-gray-800' : 'bg-white'}>
            <CardHeader>
              <CardTitle>Analytics Overview</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {stats.map((stat) => (
                  <div 
                    key={stat.label} 
                    className={`p-4 rounded-lg ${
                      darkMode 
                        ? 'bg-gray-700/50' 
                        : 'bg-gray-50/30 border border-gray-100 shadow-sm'
                    }`}
                  >
                    <div className="flex justify-between items-center mb-2">
                      <span className={darkMode ? 'text-gray-400' : 'text-black'}>
                        {stat.label}
                      </span>
                      <stat.icon className={`h-5 w-5 ${stat.color}`} />
                    </div>
                    <div className={`text-2xl font-bold ${
                      darkMode ? 'text-white' : 'text-black'
                    }`}>
                      {stat.value}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        );

      case 'settings':
        return (
          <div className="space-y-6 max-w-2xl mx-auto">
            <Card className="bg-gray-800/30 backdrop-blur-xl border border-gray-700/50 shadow-xl">
              <CardHeader>
                <CardTitle className="text-xl">Profile Settings</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Username Section */}
                <div className="space-y-4">
                  <Label className="text-lg font-semibold text-blue-400">Username</Label>
                  <div className="flex flex-col sm:flex-row gap-3">
                    <Input
                      type="text"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      className="bg-gray-900/50 border-gray-700 text-white flex-1"
                      placeholder="Enter new username"
                    />
                    <Button 
                      onClick={handleUsernameChange}
                      className="bg-blue-500 hover:bg-blue-600 text-white"
                      disabled={isLoading}
                    >
                      {isLoading ? (
                        <div className="flex items-center justify-center">
                          <Loader2 className="h-4 w-4 animate-spin mr-2" />
                          Updating...
                        </div>
                      ) : (
                        'Update Username'
                      )}
                    </Button>
                  </div>
                </div>

                {/* Bio Section */}
                <div className="space-y-4">
                  <Label className="text-lg font-semibold text-blue-400">Bio</Label>
                  <div className="space-y-2">
                    <textarea
                      className="w-full h-32 rounded-lg bg-gray-900/50 border border-gray-700 text-white p-3 resize-none"
                      placeholder="Tell visitors about yourself..."
                      value={bio}
                      onChange={(e) => setBio(e.target.value)}
                    />
                    <p className="text-sm text-gray-400">
                      {bio.length}/160 characters
                    </p>
                    <Button 
                      onClick={handleBioChange}
                      className="bg-blue-500 hover:bg-blue-600 text-white w-full"
                      disabled={isLoading}
                    >
                      <div className="flex items-center justify-center">
                        {isLoading ? (
                          <>
                            <Loader2 className="h-4 w-4 animate-spin mr-2" />
                            <span>Saving...</span>
                          </>
                        ) : (
                          <span>Save Bio</span>
                        )}
                      </div>
                    </Button>
                  </div>
                </div>

                {/* Password Change Section */}
                <div className="space-y-4">
                  <Label className="text-lg font-semibold text-blue-400">Change Password</Label>
                  
                  {passwordError && (
                    <div className="bg-red-500/10 border border-red-500/50 text-red-500 px-4 py-3 rounded">
                      {passwordError}
                    </div>
                  )}
                  
                  {passwordSuccess && (
                    <div className="bg-green-500/10 border border-green-500/50 text-green-500 px-4 py-3 rounded">
                      {passwordSuccess}
                    </div>
                  )}

                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="currentPassword">Current Password</Label>
                      <Input
                        id="currentPassword"
                        type="password"
                        value={currentPassword}
                        onChange={(e) => setCurrentPassword(e.target.value)}
                        className="bg-gray-900/50 border-gray-700 text-white"
                        placeholder="Enter your current password"
                      />
                    </div>
                    <div>
                      <Label htmlFor="newPassword">New Password</Label>
                      <Input
                        id="newPassword"
                        type="password"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        className="bg-gray-900/50 border-gray-700 text-white"
                        placeholder="Enter new password"
                      />
                    </div>
                    <div>
                      <Label htmlFor="confirmPassword">Confirm New Password</Label>
                      <Input
                        id="confirmPassword"
                        type="password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        className="bg-gray-900/50 border-gray-700 text-white"
                        placeholder="Confirm new password"
                      />
                    </div>
                    <Button 
                      onClick={handlePasswordChange}
                      className="bg-blue-500 hover:bg-blue-600 text-white w-full"
                      disabled={isPasswordLoading}
                    >
                      {isPasswordLoading ? (
                        <div className="flex items-center justify-center">
                          <Loader2 className="h-4 w-4 animate-spin mr-2" />
                          <span>Updating Password...</span>
                        </div>
                      ) : (
                        'Update Password'
                      )}
                    </Button>
                  </div>
                </div>

                {/* Danger Zone */}
                <div className="pt-6 border-t border-gray-700">
                  <h3 className="text-lg font-semibold text-red-400 mb-4">Danger Zone</h3>
                  <Button 
                    variant="destructive"
                    onClick={() => {
                      if (window.confirm('Are you sure you want to delete your account? This cannot be undone.')) {
                        handleDeleteAccount();
                      }
                    }}
                    className="bg-red-500 hover:bg-red-600"
                  >
                    Delete Account
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        );

      default:
        return null;
    }
  };

  const handleDeleteClick = (link: Link) => {
    setLinkToDelete(link);
    setShowDeleteConfirm(true);
  };

  const handleConfirmDelete = async () => {
    if (!linkToDelete) return;
    await handleDeleteLink(linkToDelete);
  };

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const data = await getUserProfile();
        setBio(data.user.bio || '');
      } catch (err) {
        console.error('Failed to fetch profile:', err);
      }
    };

    fetchUserProfile();
  }, []);

  const showToast = (message: string, type: 'success' | 'error' | 'loading') => {
    const id = Math.random().toString(36).substring(7);
    setToasts(prev => [...prev, { id, message, type }]);
    if (type !== 'loading') {
      setTimeout(() => {
        setToasts(prev => prev.filter(toast => toast.id !== id));
      }, 3000);
    }
    return id;
  };

  const removeToast = (id: string) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  };

  // Show loading screen while checking auth
  if (isLoading) {
    return <LoadingScreen />
  }

  // If not authenticated, don't render anything (redirect will happen)
  if (!username) {
    return null
  }

  return (
    <div className={`min-h-screen ${darkMode ? 'bg-gray-900' : 'bg-white'}`}>
      {/* Top Navigation Bar */}
      <nav className="fixed top-0 w-full z-50 bg-gray-800/90 backdrop-blur-lg border-b border-gray-700/50 text-white">
        <div className="flex items-center justify-between px-4 h-16">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-500 to-cyan-400 flex items-center justify-center text-white font-bold text-lg">
              {username?.slice(0, 2).toUpperCase()}
            </div>
            <span className="font-medium text-lg hidden sm:block">{username}</span>
          </div>

          <Button 
            variant="ghost" 
            size="sm"
            onClick={handleLogout}
            className="text-red-400 hover:text-red-300 hover:bg-red-400/10"
          >
            <LogOut className="h-5 w-5" />
          </Button>
        </div>
      </nav>

      {/* Bottom Navigation Bar with glassy effect and smaller icons */}
      <div className="fixed bottom-4 left-1/2 -translate-x-1/2 bg-gray-800/30 backdrop-blur-xl border border-white/10 z-50 sm:hidden rounded-full px-6 py-2 w-[90%] max-w-md shadow-[0_8px_32px_0_rgba(0,0,0,0.37)]">
        <div className="flex justify-around items-center">
          {navigationItems.map((item) => {
            const Icon = item.icon;
            return (
              <Button
                key={item.id}
                variant="ghost"
                className={`p-2 transition-all duration-300 ${
                  activeTab === item.id 
                    ? 'text-blue-400 bg-white/5 backdrop-blur-lg rounded-full' 
                    : 'text-gray-400 hover:text-white hover:bg-white/5'
                }`}
                onClick={() => handleTabChange(item.id)}
              >
                <Icon size={18} />
              </Button>
            );
          })}
        </div>
      </div>

      {/* Side Navigation for desktop */}
      <div className="hidden sm:flex fixed left-0 top-16 bottom-0 w-20 flex-col items-center py-6 bg-gray-800/30 backdrop-blur-xl border-r border-white/5 text-white">
        <div className="flex flex-col items-center space-y-6">
          {navigationItems.map((item) => (
            <Button
              key={item.id}
              variant="ghost"
              className={`group relative flex flex-col items-center justify-center w-12 h-12 rounded-xl transition-all duration-300 ${
                activeTab === item.id 
                  ? 'bg-blue-500/20 text-blue-400' 
                  : 'text-gray-400 hover:text-white hover:bg-white/5'
              }`}
              onClick={() => handleTabChange(item.id)}
            >
              <item.icon size={22} />
              <span className="absolute left-16 px-2 py-1 min-w-max text-sm font-medium rounded-md opacity-0 bg-gray-800 transition-all duration-300 scale-95 -translate-x-3 pointer-events-none group-hover:opacity-100 group-hover:translate-x-0 group-hover:scale-100">
                {item.label}
              </span>
              {activeTab === item.id && (
                <motion.div
                  layoutId="activeTab"
                  className="absolute right-0 w-1 h-8 bg-blue-400 rounded-l-full"
                />
              )}
            </Button>
          ))}
        </div>
      </div>

      {/* Main Content */}
      <main className="pt-16 pb-16 sm:pb-4 sm:pl-20">
        <div className="max-w-7xl mx-auto p-4">
          <motion.div 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="space-y-6"
          >
            <AnimatePresence>
              {toasts.map(toast => (
                <Toast
                  key={toast.id}
                  message={toast.message}
                  type={toast.type}
                  onClose={() => removeToast(toast.id)}
                />
              ))}
            </AnimatePresence>
            {renderContent()}
          </motion.div>
        </div>
      </main>
      {showDeleteConfirm && linkToDelete && (
        <DeleteConfirmationModal
          isOpen={showDeleteConfirm}
          linkTitle={linkToDelete.title}
          onConfirm={() => handleDeleteLink(linkToDelete)}
          onCancel={() => {
            setShowDeleteConfirm(false);
            setLinkToDelete(null);
          }}
          isDeleting={deletingLinkId === linkToDelete.id}
        />
      )}
    </div>
  )
} 