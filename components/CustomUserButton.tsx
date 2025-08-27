"use client"

import { useUser } from "@clerk/nextjs"
import { UserButton } from "@clerk/nextjs"
import { UserProfileModal } from "./UserProfileModal"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useState, useEffect } from "react"

interface UserProfile {
  role: 'founder' | 'creator' | 'backer' | null
}

const roleConfig = {
  founder: { label: "Founder", color: "#21C087" },
  creator: { label: "Creator", color: "#F5B800" },
  backer: { label: "Backer", color: "#0B1E3C" }
}

export function CustomUserButton() {
  const { user } = useUser()
  const [profile, setProfile] = useState<UserProfile | null>(null)

  useEffect(() => {
    if (user) {
      fetchProfile()
    }
  }, [user])

  const fetchProfile = async () => {
    if (!user) return
    
    try {
      const response = await fetch('/api/user-profile')
      if (response.ok) {
        const data = await response.json()
        setProfile(data)
      } else if (response.status === 404) {
        // No profile exists yet
        setProfile(null)
      }
    } catch (error) {
      console.error('Error fetching profile:', error)
    }
  }

  if (!user) {
    return <UserButton />
  }

  return (
    <UserProfileModal>
      <Button variant="ghost" className="relative p-0 h-auto w-auto">
        <div className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-100 transition-colors">
          <Avatar className="h-8 w-8">
            <AvatarImage src={user.imageUrl} alt={user.fullName || 'User'} />
            <AvatarFallback className="bg-[#21C087] text-white text-sm">
              {user.firstName?.charAt(0)}{user.lastName?.charAt(0)}
            </AvatarFallback>
          </Avatar>
          <div className="hidden md:flex flex-col items-start">
            <span className="text-sm font-medium text-gray-900">
              {user.firstName || user.fullName}
            </span>
            {profile?.role && (
              <Badge 
                className="text-xs px-2 py-0.5"
                style={{ 
                  backgroundColor: roleConfig[profile.role].color + '20',
                  color: roleConfig[profile.role].color,
                  border: `1px solid ${roleConfig[profile.role].color}`
                }}
              >
                {roleConfig[profile.role].label}
              </Badge>
            )}
          </div>
        </div>
      </Button>
    </UserProfileModal>
  )
}
