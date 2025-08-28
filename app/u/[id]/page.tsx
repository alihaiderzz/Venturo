"use client"

import React, { useState, useEffect } from "react"
import { useParams } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Loader2, MapPin, Globe, Building, Rocket, Palette, DollarSign, MessageCircle, Calendar, Eye } from "lucide-react"
import Link from "next/link"

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

interface StartupIdea {
  id: string
  title: string
  one_liner: string
  category: string
  stage: string
  created_at: string
  stats: {
    views: number
    saves: number
    messages: number
  }
}

const roleConfig = {
  founder: {
    label: "Founder",
    description: "I have a startup idea and need collaborators",
    icon: Rocket,
    color: "#21C087",
    features: ["Upload startup ideas", "Find collaborators", "Access to backers", "Event priority"]
  },
  creator: {
    label: "Creator", 
    description: "I have skills to offer and want to join projects",
    icon: Palette,
    color: "#F5B800",
    features: ["Showcase skills", "Join startup teams", "Network with founders", "Skill marketplace"]
  },
  backer: {
    label: "Backer",
    description: "I want to invest in promising Australian startups",
    icon: DollarSign,
    color: "#0B1E3C",
    features: ["Browse startup ideas", "Connect with founders", "Investment opportunities", "Due diligence tools"]
  }
}

export default function UserProfilePage() {
  const params = useParams()
  const userId = params.id as string
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [ideas, setIdeas] = useState<StartupIdea[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (userId) {
      fetchUserProfile()
      fetchUserIdeas()
    }
  }, [userId])

  const fetchUserProfile = async () => {
    try {
      const response = await fetch(`/api/user-profile/${userId}`)
      if (response.ok) {
        const data = await response.json()
        setProfile(data)
      } else {
        setError('User not found')
      }
    } catch (error) {
      console.error('Error fetching user profile:', error)
      setError('Failed to load user profile')
    } finally {
      setLoading(false)
    }
  }

  const fetchUserIdeas = async () => {
    try {
      const response = await fetch(`/api/ideas?owner_id=${userId}`)
      if (response.ok) {
        const data = await response.json()
        setIdeas(data)
      }
    } catch (error) {
      console.error('Error fetching user ideas:', error)
    }
  }

  const getRoleConfig = (role: string) => {
    return roleConfig[role as keyof typeof roleConfig] || roleConfig.founder
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F6F7F9] flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin text-[#21C087] mx-auto mb-4" />
          <p className="text-gray-600">Loading profile...</p>
        </div>
      </div>
    )
  }

  if (error || !profile) {
  return (
      <div className="min-h-screen bg-[#F6F7F9] flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">User Not Found</h1>
          <p className="text-gray-600 mb-4">{error || 'This user profile does not exist.'}</p>
          <Link href="/">
            <Button className="bg-[#21C087] hover:bg-[#1BA876]">
              Back to Home
            </Button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#F6F7F9]">
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Profile Header */}
        <Card className="mb-8">
          <CardHeader className="pb-6">
            <div className="flex items-start gap-6">
              <Avatar className="h-24 w-24">
                <AvatarImage src={`https://api.dicebear.com/7.x/initials/svg?seed=${profile.full_name}`} alt={profile.full_name} />
                <AvatarFallback className="bg-[#21C087] text-white text-2xl">
                  {profile.full_name.split(' ').map(n => n[0]).join('')}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <CardTitle className="text-3xl">{profile.full_name}</CardTitle>
                  {profile.role && (
                    <Badge 
                      className="text-sm px-3 py-1"
                      style={{ 
                        backgroundColor: getRoleConfig(profile.role).color,
                        color: 'white'
                      }}
                    >
                      {getRoleConfig(profile.role).label}
                    </Badge>
                  )}
                </div>
                
                {profile.bio && (
                  <CardDescription className="text-lg mb-4">
                    {profile.bio}
                  </CardDescription>
                )}

                <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                  {profile.location && (
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4" />
                      {profile.location}
                    </div>
                  )}
                  {profile.website && (
                    <div className="flex items-center gap-2">
                      <Globe className="h-4 w-4" />
                      <a 
                        href={profile.website} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-[#21C087] hover:underline"
                      >
                        Website
                      </a>
                    </div>
                  )}
                  {profile.company && (
                    <div className="flex items-center gap-2">
                      <Building className="h-4 w-4" />
                      {profile.company}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </CardHeader>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Role Information */}
            {profile.role && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    {(() => {
                      const IconComponent = getRoleConfig(profile.role).icon;
                      return <IconComponent 
                        className="h-5 w-5"
                        style={{ color: getRoleConfig(profile.role).color }}
                      />;
                    })()}
                    About {getRoleConfig(profile.role).label}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 mb-4">
                    {getRoleConfig(profile.role).description}
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {getRoleConfig(profile.role).features.map((feature, index) => (
                      <div key={index} className="flex items-center gap-2 text-sm">
                        <div 
                          className="w-2 h-2 rounded-full"
                          style={{ backgroundColor: getRoleConfig(profile.role!).color }}
                        />
                        {feature}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* User's Ideas */}
            {ideas.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>Startup Ideas</CardTitle>
                  <CardDescription>
                    Ideas shared by {profile.full_name}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {ideas.map((idea) => (
                      <div key={idea.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                        <div className="flex items-start justify-between mb-2">
                          <h3 className="font-semibold text-lg">{idea.title}</h3>
                          <Badge variant="outline">{idea.category}</Badge>
                        </div>
                        <p className="text-gray-600 mb-3">{idea.one_liner}</p>
                        <div className="flex items-center justify-between text-sm text-gray-500">
                          <div className="flex items-center gap-4">
                            <span className="flex items-center gap-1">
                              <Eye className="h-4 w-4" />
                              {idea.stats.views}
                            </span>
                            <span className="flex items-center gap-1">
                              <MessageCircle className="h-4 w-4" />
                              {idea.stats.messages}
                            </span>
                          </div>
                          <Link href={`/idea/${idea.id}`}>
                            <Button variant="outline" size="sm">
                              View Details
                            </Button>
                          </Link>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {ideas.length === 0 && profile.role === 'founder' && (
              <Card>
                <CardContent className="pt-6">
                  <div className="text-center py-8">
                    <Rocket className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold mb-2">No Ideas Yet</h3>
                    <p className="text-gray-600 mb-4">
                      {profile.full_name} hasn't shared any startup ideas yet.
                    </p>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Contact Card */}
            <Card>
              <CardHeader>
                <CardTitle>Get in Touch</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button className="w-full bg-[#21C087] hover:bg-[#1BA876]" asChild>
                  <Link href={`/messages?to=${profile.id}`}>
                    <MessageCircle className="h-4 w-4 mr-2" />
                    Send Message
                  </Link>
                </Button>
                <Button variant="outline" className="w-full" asChild>
                  <Link href="/events">
                    <Calendar className="h-4 w-4 mr-2" />
                    View Events
                  </Link>
                </Button>
              </CardContent>
            </Card>

            {/* Member Since */}
            <Card>
              <CardHeader>
                <CardTitle>Member Since</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600">
                  {new Date(profile.created_at).toLocaleDateString('en-AU', {
                    year: 'numeric',
                    month: 'long'
                  })}
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}

