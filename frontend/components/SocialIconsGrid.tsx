import React from 'react'
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
} from 'react-icons/fa'

export const socialIcons = [
  { name: 'Facebook', icon: FaFacebook, color: '#1877F2' },
  { name: 'Twitter', icon: FaTwitter, color: '#000000' },
  { name: 'Instagram', icon: FaInstagram, color: '#E4405F' },
  { name: 'LinkedIn', icon: FaLinkedin, color: '#0A66C2' },
  { name: 'TikTok', icon: FaTiktok, color: '#000000' },
  { name: 'YouTube', icon: FaYoutube, color: '#FF0000' },
  { name: 'GitHub', icon: FaGithub, color: '#181717' },
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

console.log('Available social icons:', socialIcons.map(s => s.name));

interface SocialIconsGridProps {
  selectedType: string;
  onSelect: (type: string) => void;
}

export default function SocialIconsGrid({ selectedType, onSelect }: SocialIconsGridProps) {
  return (
    <div className="max-h-[300px] overflow-y-auto rounded-lg border border-gray-700 p-4">
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {socialIcons.map((social) => {
          const IconComponent = social.icon
          return (
            <button
              key={social.name}
              onClick={() => onSelect(social.name)}
              className={`flex items-center gap-3 p-3 rounded-lg transition-all ${
                selectedType === social.name 
                  ? 'bg-blue-500/20 ring-2 ring-blue-500' 
                  : 'hover:bg-gray-700/50'
              }`}
            >
              <IconComponent 
                size={24}
                style={{ color: social.color }}
              />
              <span className="text-sm font-medium">{social.name}</span>
            </button>
          )
        })}
      </div>
    </div>
  )
} 