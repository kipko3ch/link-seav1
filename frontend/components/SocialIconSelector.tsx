'use client'
import React from 'react'
import {
  Facebook,
  Twitter,
  Instagram,
  Linkedin,
  Youtube,
  Github,
  Globe,
  Mail,
  Link as LinkIcon,
} from 'lucide-react'

interface SocialIconSelectorProps {
  value: string;
  onChange: (value: string) => void;
}

const socialIcons = [
  { name: 'Facebook', icon: Facebook, color: '#1877F2' },
  { name: 'Twitter', icon: Twitter, color: '#1DA1F2' },
  { name: 'Instagram', icon: Instagram, color: '#E4405F' },
  { name: 'LinkedIn', icon: Linkedin, color: '#0A66C2' },
  { name: 'YouTube', icon: Youtube, color: '#FF0000' },
  { name: 'GitHub', icon: Github, color: '#181717' },
  { name: 'Website', icon: Globe, color: '#4285F4' },
  { name: 'Email', icon: Mail, color: '#EA4335' },
  { name: 'Other', icon: LinkIcon, color: '#718096' },
]

export default function SocialIconSelector({ value, onChange }: SocialIconSelectorProps) {
  return (
    <div className="grid grid-cols-3 gap-4 p-4 bg-[#002b4d] rounded-lg">
      {socialIcons.map((social) => {
        const Icon = social.icon
        return (
          <button
            key={social.name}
            onClick={() => onChange(social.name)}
            className={`p-3 rounded-lg flex flex-col items-center gap-2 transition-all ${
              value === social.name
                ? 'bg-[#004080] ring-2 ring-[#00FFFF]'
                : 'hover:bg-[#003366]'
            }`}
          >
            <Icon style={{ color: social.color }} />
            <span className="text-xs text-[#A0D8EF]">{social.name}</span>
          </button>
        )
      })}
    </div>
  )
} 