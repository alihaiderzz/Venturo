"use client"

import React, { useState, useEffect } from "react"
import { useUser } from "@clerk/nextjs"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Separator } from "@/components/ui/separator"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Loader2, User, Edit, Save, X, Rocket, Palette, DollarSign, MapPin, Globe, Briefcase } from "lucide-react"
import Link from "next/link"
import { useToast } from "@/hooks/use-toast"

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
  description: string
  category: string
  stage: string
  status: string
  created_at: string
  updated_at: string
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

export function UserProfileModal({ children }: { children: React.ReactNode }) {
  const { user } = useUser()
  const { toast } = useToast()
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [userIdeas, setUserIdeas] = useState<StartupIdea[]>([])
  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [ideasLoading, setIdeasLoading] = useState(false)
  const [formData, setFormData] = useState({
    role: '',
    bio: '',
    location: '',
    website: '',
    company: ''
  })

  useEffect(() => {
    if (user) {
      fetchProfile()
      fetchUserIdeas()
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
        // Check if data exists before accessing its properties
        if (data) {
          console.log('Setting form data with:', data)
          setFormData({
            role: data.role || '',
            bio: data.bio || '',
            location: data.location || '',
            website: data.website || '',
            company: data.company || ''
          })
        } else {
          // If no profile exists, set empty form data
          console.log('No profile data, setting empty form')
          setFormData({
            role: '',
            bio: '',
            location: '',
            website: '',
            company: ''
          })
        }
      } else if (response.status === 404) {
        // No profile exists yet, set empty form data
        setProfile(null)
        setFormData({
          role: '',
          bio: '',
          location: '',
          website: '',
          company: ''
        })
      }
    } catch (error) {
      console.error('Error fetching profile:', error)
    } finally {
      setLoading(false)
    }
  }

  const fetchUserIdeas = async () => {
    if (!user) return
    
    setIdeasLoading(true)
    try {
      const response = await fetch('/api/user-ideas')
      if (response.ok) {
        const data = await response.json()
        setUserIdeas(data.data || [])
      }
    } catch (error) {
      console.error('Error fetching user ideas:', error)
    } finally {
      setIdeasLoading(false)
    }
  }



  const handleDeleteIdea = async (ideaId: string) => {
    const idea = userIdeas.find(i => i.id === ideaId)
    const ideaTitle = idea?.title || 'this idea'
    
    if (!confirm(`Are you sure you want to delete "${ideaTitle}"? This action cannot be undone and the idea will be permanently removed from Venturo.`)) {
      return
    }

    try {
      const response = await fetch(`/api/user-ideas/${ideaId}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        // Small delay to ensure server has processed the deletion
        await new Promise(resolve => setTimeout(resolve, 500))
        // Refresh the ideas list from the server to ensure it's up to date
        await fetchUserIdeas()
        toast({
          title: "Idea deleted successfully!",
          description: "The idea has been permanently removed from your profile.",
        })
      } else {
        const error = await response.json()
        console.error('Delete error:', error)
        toast({
          title: "Failed to delete idea",
          description: error.error || error.message || "An error occurred while deleting the idea. Please try again.",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error('Error deleting idea:', error)
      toast({
        title: "Error deleting idea",
        description: "Please try again or contact support if the problem persists.",
        variant: "destructive",
      })
    }
  }

  const handleSave = async () => {
    if (!user) return
    
    setSaving(true)
    try {
      const response = await fetch('/api/user-profile', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: user.primaryEmailAddress?.emailAddress,
          full_name: user.fullName,
          role: formData.role,
          bio: formData.bio,
          location: formData.location,
          website: formData.website,
          company: formData.company
        }),
      })

      if (response.ok) {
        const result = await response.json()
        await fetchProfile()
        setIsEditing(false)
        toast({
          title: "Success!",
          description: "Profile updated successfully!",
        })
      } else {
        const errorData = await response.json()
        console.error('Profile update failed:', errorData)
        toast({
          title: "Failed to update profile",
          description: errorData.error || "Please try again or contact support.",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error('Error updating profile:', error)
      toast({
        title: "Error updating profile",
        description: "Please check your connection and try again.",
        variant: "destructive",
      })
    } finally {
      setSaving(false)
    }
  }

  const getRoleConfig = (role: string) => {
    return roleConfig[role as keyof typeof roleConfig] || roleConfig.founder
  }

  // Debug log to see formData
  console.log('Current formData:', formData)

  if (!user) return null

  return (
    <Dialog>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            Profile Management
          </DialogTitle>
          <DialogDescription>
            Manage your Venturo profile and role preferences
          </DialogDescription>
        </DialogHeader>

        {loading ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-8 w-8 animate-spin text-[#21C087]" />
          </div>
        ) : (
          <div className="space-y-6">
            {/* Profile Header */}
            <Card>
              <CardHeader className="pb-4">
                <div className="flex items-center gap-4">
                  <Avatar className="h-16 w-16">
                    <AvatarImage src={user.imageUrl} alt={user.fullName || 'User'} />
                    <AvatarFallback className="bg-[#21C087] text-white text-lg">
                      {user.firstName?.charAt(0)}{user.lastName?.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <CardTitle className="text-xl">{user.fullName}</CardTitle>
                    <CardDescription>{user.primaryEmailAddress?.emailAddress}</CardDescription>
                    {profile?.role && (
                      <Badge 
                        className="mt-2"
                        style={{ backgroundColor: getRoleConfig(profile.role).color, color: 'white' }}
                      >
                        {getRoleConfig(profile.role).label}
                      </Badge>
                    )}
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setIsEditing(!isEditing)}
                    className="flex items-center gap-2"
                  >
                    {isEditing ? <X className="h-4 w-4" /> : <Edit className="h-4 w-4" />}
                    {isEditing ? 'Cancel' : 'Edit'}
                  </Button>
                </div>
              </CardHeader>
            </Card>

            {/* Role Selection */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Briefcase className="h-5 w-5" />
                  Your Role
                </CardTitle>
                <CardDescription>
                  Choose how you want to participate in the Venturo community
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {isEditing ? (
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="role">Select Your Role</Label>
                      <Select value={formData.role} onValueChange={(value) => setFormData({...formData, role: value})}>
                        <SelectTrigger>
                          <SelectValue placeholder="Choose your role" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="founder">Founder</SelectItem>
                          <SelectItem value="creator">Creator</SelectItem>
                          <SelectItem value="backer">Backer</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    {formData.role && (
                      <Card className="border-2" style={{ borderColor: getRoleConfig(formData.role).color }}>
                        <CardContent className="pt-4">
                          <div className="flex items-start gap-3">
                            <div 
                              className="p-2 rounded-lg"
                              style={{ backgroundColor: getRoleConfig(formData.role).color + '20' }}
                            >
                              {(() => {
                                const IconComponent = getRoleConfig(formData.role).icon;
                                return <IconComponent 
                                  className="h-5 w-5"
                                  style={{ color: getRoleConfig(formData.role).color }}
                                />;
                              })()}
                            </div>
                            <div className="flex-1">
                              <h4 className="font-semibold">{getRoleConfig(formData.role).label}</h4>
                              <p className="text-sm text-muted-foreground mt-1">
                                {getRoleConfig(formData.role).description}
                              </p>
                              <ul className="text-sm text-muted-foreground mt-2 space-y-1">
                                {getRoleConfig(formData.role).features.map((feature, index) => (
                                  <li key={index} className="flex items-center gap-2">
                                    <div className="w-1 h-1 bg-current rounded-full" />
                                    {feature}
                                  </li>
                                ))}
                              </ul>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    )}
                  </div>
                ) : (
                  <div className="space-y-4">
                    {profile?.role ? (
                      <Card className="border-2" style={{ borderColor: getRoleConfig(profile.role).color }}>
                        <CardContent className="pt-4">
                          <div className="flex items-start gap-3">
                            <div 
                              className="p-2 rounded-lg"
                              style={{ backgroundColor: getRoleConfig(profile.role).color + '20' }}
                            >
                              {(() => {
                                const IconComponent = getRoleConfig(profile.role).icon;
                                return <IconComponent 
                                  className="h-5 w-5"
                                  style={{ color: getRoleConfig(profile.role).color }}
                                />;
                              })()}
                            </div>
                            <div className="flex-1">
                              <h4 className="font-semibold">{getRoleConfig(profile.role).label}</h4>
                              <p className="text-sm text-muted-foreground mt-1">
                                {getRoleConfig(profile.role).description}
                              </p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ) : (
                      <div className="text-center py-4 text-muted-foreground">
                        No role selected yet
                      </div>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Additional Profile Info */}
            <Card>
              <CardHeader>
                <CardTitle>Additional Information</CardTitle>
                <CardDescription>
                  Help others understand your background and interests
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {isEditing ? (
                  <>
                    <div>
                      <Label htmlFor="bio">Bio</Label>
                      <textarea
                        id="bio"
                        placeholder="Tell us about yourself, your experience, and what you're looking for..."
                        value={formData.bio}
                        onChange={(e) => setFormData({...formData, bio: e.target.value})}
                        rows={4}
                        className="min-h-[100px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                      />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="location">Location</Label>
                        <div className="relative">
                          <MapPin className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                          <Input
                            id="location"
                            placeholder="City, State"
                            value={formData.location}
                            onChange={(e) => setFormData({...formData, location: e.target.value})}
                            className="pl-10"
                          />
                        </div>
                      </div>
                      <div>
                        <Label htmlFor="website">Website</Label>
                        <div className="relative">
                          <Globe className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                          <Input
                            id="website"
                            placeholder="https://yourwebsite.com"
                            value={formData.website}
                            onChange={(e) => setFormData({...formData, website: e.target.value})}
                            className="pl-10"
                          />
                        </div>
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="company">Company/Organization</Label>
                      <Input
                        id="company"
                        placeholder="Your current company or organization"
                        value={formData.company}
                        onChange={(e) => setFormData({...formData, company: e.target.value})}
                      />
                    </div>
                  </>
                ) : (
                  <div className="space-y-3">
                    {profile?.bio && (
                      <div>
                        <Label className="text-sm font-medium">Bio</Label>
                        <p className="text-sm text-muted-foreground mt-1">{profile.bio}</p>
                      </div>
                    )}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {profile?.location && (
                        <div>
                          <Label className="text-sm font-medium">Location</Label>
                          <p className="text-sm text-muted-foreground mt-1 flex items-center gap-2">
                            <MapPin className="h-4 w-4" />
                            {profile.location}
                          </p>
                        </div>
                      )}
                      {profile?.website && (
                        <div>
                          <Label className="text-sm font-medium">Website</Label>
                          <p className="text-sm text-muted-foreground mt-1 flex items-center gap-2">
                            <Globe className="h-4 w-4" />
                            <a href={profile.website} target="_blank" rel="noopener noreferrer" className="text-[#21C087] hover:underline">
                              {profile.website}
                            </a>
                          </p>
                        </div>
                      )}
                    </div>
                    {profile?.company && (
                      <div>
                        <Label className="text-sm font-medium">Company</Label>
                        <p className="text-sm text-muted-foreground mt-1">{profile.company}</p>
                      </div>
                    )}
                    {!profile?.bio && !profile?.location && !profile?.website && !profile?.company && (
                      <div className="text-center py-4 text-muted-foreground">
                        No additional information added yet
                      </div>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* User's Ideas Management */}
            {profile?.role === 'founder' && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Rocket className="h-5 w-5" />
                    My Startup Ideas
                  </CardTitle>
                  <CardDescription>
                    Manage your published startup ideas
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {ideasLoading ? (
                    <div className="flex items-center justify-center py-4">
                      <Loader2 className="h-6 w-6 animate-spin text-[#21C087]" />
                    </div>
                  ) : userIdeas.length > 0 ? (
                    <div className="space-y-4">
                      {userIdeas.map((idea) => (
                        <div key={idea.id} className="border rounded-lg p-4">
                          <div className="flex items-start justify-between mb-2">
                            <h4 className="font-semibold">{idea.title}</h4>
                            <Badge variant="outline">{idea.category}</Badge>
                          </div>
                          <p className="text-sm text-muted-foreground mb-3">{idea.one_liner}</p>
                          <div className="flex items-center justify-between text-sm text-muted-foreground">
                            <div className="flex items-center gap-4">
                              <span>Views: {idea.stats?.views || 0}</span>
                              <span>Messages: {idea.stats?.messages || 0}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Button variant="outline" size="sm" asChild>
                                <Link href={`/idea/${idea.id}`}>
                                  View
                                </Link>
                              </Button>
                              <Button variant="outline" size="sm" asChild>
                                <Link href={`/edit-idea/${idea.id}`}>
                                  Edit
                                </Link>
                              </Button>
                              <Button 
                                variant="outline" 
                                size="sm"
                                onClick={() => handleDeleteIdea(idea.id)}
                                className="text-red-600 hover:text-red-700"
                              >
                                Delete
                              </Button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-6">
                      <Rocket className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                      <h4 className="font-semibold mb-2">No Ideas Yet</h4>
                      <p className="text-sm text-muted-foreground mb-4">
                        Share your startup idea with the community
                      </p>
                      <Button asChild className="bg-[#21C087] hover:bg-[#1BA876]">
                        <Link href="/create">
                          Upload Your First Idea
                        </Link>
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}

            {/* Save Button */}
            {isEditing && (
              <div className="flex justify-end gap-3">
                <Button variant="outline" onClick={() => setIsEditing(false)}>
                  Cancel
                </Button>
                <Button 
                  onClick={handleSave} 
                  disabled={saving}
                  className="bg-[#21C087] hover:bg-[#1BA876]"
                >
                  {saving ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin mr-2" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save className="h-4 w-4 mr-2" />
                      Save Changes
                    </>
                  )}
                </Button>
              </div>
            )}
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}
