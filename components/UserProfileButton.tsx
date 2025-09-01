"use client"

import React, { useState, useEffect } from "react"
import { useUser, useClerk } from "@clerk/nextjs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { UserProfileModal } from "./UserProfileModal"
import { Rocket, Palette, DollarSign, LogOut, User } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

interface UserProfile {
  id: string
  clerk_user_id: string
  email: string
  full_name: string
  role: 'founder' | 'creator' | 'backer' | null
  bio: string | null
  location: string | null
  website: string | null
  company: string | null
  profile_completed: boolean
  created_at: string
  updated_at: string
}

const roleConfig = {
  founder: {
    label: "Founder",
    icon: Rocket,
    color: "#21C087",
  },
  creator: {
    label: "Creator", 
    icon: Palette,
    color: "#F5B800",
  },
  backer: {
    label: "Backer",
    icon: DollarSign,
    color: "#0B1E3C",
  }
}

export function UserProfileButton() {
  const { user } = useUser()
  const { signOut } = useClerk()
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (user) {
      fetchProfile()
    }
  }, [user])

  const fetchProfile = async () => {
    if (!user) return
    
    setLoading(true)
    try {
      const response = await fetch('/api/user-profile')
      if (response.ok) {
        const data = await response.json()
        setProfile(data)
      }
    } catch (error) {
      console.error('Error fetching profile:', error)
    } finally {
      setLoading(false)
    }
  }

  const getRoleConfig = (role: string) => {
    return roleConfig[role as keyof typeof roleConfig] || roleConfig.founder
  }

  if (!user) return null

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative p-2 h-auto">
          <div className="flex items-center gap-2">
            <Avatar className="h-8 w-8">
              <AvatarImage src={user.imageUrl} alt={user.fullName || 'User'} />
              <AvatarFallback className="bg-[#21C087] text-white text-sm">
                {user.firstName?.charAt(0)}{user.lastName?.charAt(0)}
              </AvatarFallback>
            </Avatar>
            {profile?.role && (
              <Badge 
                className="text-xs px-2 py-1"
                style={{ 
                  backgroundColor: getRoleConfig(profile.role).color,
                  color: 'white'
                }}
              >
                {getRoleConfig(profile.role).label}
              </Badge>
            )}
          </div>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <UserProfileModal onProfileUpdate={fetchProfile}>
          <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
            <User className="mr-2 h-4 w-4" />
            <span>Profile Settings</span>
          </DropdownMenuItem>
        </UserProfileModal>
        <DropdownMenuItem onClick={() => signOut({ redirectUrl: '/' })}>
          <LogOut className="mr-2 h-4 w-4" />
          <span>Sign out</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
