"use client"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Save, User, MapPin, Briefcase, Globe, Link as LinkIcon, Loader2, CheckCircle } from "lucide-react"
import Link from "next/link"
import { LegalNotice } from "@/components/LegalNotice"
import { SignedIn, SignedOut, RedirectToSignIn, useUser } from "@clerk/nextjs"
import { useToast } from "@/hooks/use-toast"

export default function ProfilePage() {
  const { user } = useUser()
  const { toast } = useToast()
  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [profile, setProfile] = useState({
    email: "",
    full_name: "",
    role: "founder",
    bio: "",
    location: "",
    website: "",
    company: "",
    state: "",
    sectors: [] as string[],
    skills: [] as string[],
    time_commitment: "part-time",
    indicative_ticket: "$5k-$25k",
    social_links: {
      linkedin: "",
      twitter: "",
      instagram: "",
      website: ""
    }
  })

  // Load existing profile data
  useEffect(() => {
    const loadProfile = async () => {
      if (!user) return
      
      setLoading(true)
      try {
        const response = await fetch("/api/user-profile")
        if (response.ok) {
          const data = await response.json()
          if (data) {
            setProfile({
              email: data.email || user.emailAddresses[0]?.emailAddress || "",
              full_name: data.full_name || "",
              role: data.role || "founder",
              bio: data.bio || "",
              location: data.location || "",
              website: data.website || "",
              company: data.company || "",
              state: data.state || "",
              sectors: data.sectors || [],
              skills: data.skills || [],
              time_commitment: data.time_commitment || "part-time",
              indicative_ticket: data.indicative_ticket || "$5k-$25k",
              social_links: data.social_links || {
                linkedin: "",
                twitter: "",
                instagram: "",
                website: ""
              }
            })
          }
        }
      } catch (error) {
        console.error("Error loading profile:", error)
        toast({
          title: "Error",
          description: "Failed to load profile data",
          variant: "destructive",
        })
      } finally {
        setLoading(false)
      }
    }

    loadProfile()
  }, [user, toast])

  const handleSave = async () => {
    if (!user) return

    setSaving(true)
    try {
      const response = await fetch("/api/debug-profile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: profile.email,
          full_name: profile.full_name,
          role: profile.role,
          bio: profile.bio,
          location: profile.location,
          website: profile.website,
          company: profile.company,
          state: profile.state,
          sectors: profile.sectors,
          skills: profile.skills,
          time_commitment: profile.time_commitment,
          indicative_ticket: profile.indicative_ticket,
          social_links: profile.social_links
        }),
      })

      if (response.ok) {
        const result = await response.json()
        console.log("Profile saved successfully!", result)
        toast({
          title: "Success!",
          description: "Profile saved successfully! 🎉",
        })
      } else {
        const errorData = await response.json()
        console.error("Failed to save profile:", errorData.error)
        toast({
          title: "Error",
          description: errorData.error || "Failed to save profile",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Error saving profile:", error)
      toast({
        title: "Error",
        description: "Error saving profile. Please try again.",
        variant: "destructive",
      })
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p>Loading profile...</p>
        </div>
      </div>
    )
  }

  return (
    <>
      <SignedOut>
        <RedirectToSignIn />
      </SignedOut>
      <SignedIn>
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
          {/* Header */}
          <header className="bg-white border-b border-gray-200 shadow-sm">
            <div className="container mx-auto px-4 py-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <Button variant="ghost" size="sm" asChild>
                    <Link href="/dashboard" aria-label="Back to dashboard">
                      <ArrowLeft className="h-4 w-4 mr-2" />
                      Back
                    </Link>
                  </Button>
                  <h1 className="text-xl font-semibold">Edit Profile</h1>
                </div>
                <Button 
                  onClick={handleSave} 
                  disabled={saving}
                  className="bg-[#21C087] hover:bg-[#1a9f6f] text-white"
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
            </div>
          </header>

          <main className="container mx-auto px-4 py-8">
            <div className="grid gap-6 lg:grid-cols-3">
              {/* Main Profile Form */}
              <div className="lg:col-span-2 space-y-6">
                {/* Basic Information */}
                <Card className="bg-white/70">
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <User className="h-5 w-5 mr-2 text-blue-500" />
                      Basic Information
                    </CardTitle>
                    <CardDescription>Your personal and professional details</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm font-medium mb-2 block">Full Name *</label>
                        <Input 
                          value={profile.full_name} 
                          onChange={(e) => setProfile({...profile, full_name: e.target.value})}
                          placeholder="Your full name"
                        />
                      </div>
                      <div>
                        <label className="text-sm font-medium mb-2 block">Role *</label>
                        <Select value={profile.role} onValueChange={(value) => setProfile({...profile, role: value})}>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="founder">Founder</SelectItem>
                            <SelectItem value="creator">Creator</SelectItem>
                            <SelectItem value="backer">Backer</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <div>
                      <label className="text-sm font-medium mb-2 block">Email</label>
                      <Input 
                        value={profile.email} 
                        onChange={(e) => setProfile({...profile, email: e.target.value})}
                        placeholder="your.email@example.com"
                        type="email"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium mb-2 block">Bio</label>
                      <Textarea 
                        value={profile.bio} 
                        onChange={(e) => setProfile({...profile, bio: e.target.value})}
                        placeholder="Tell us about yourself and your experience"
                        rows={3}
                      />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm font-medium mb-2 block">Location</label>
                        <Input 
                          value={profile.location} 
                          onChange={(e) => setProfile({...profile, location: e.target.value})}
                          placeholder="e.g., Sydney, NSW"
                        />
                      </div>
                      <div>
                        <label className="text-sm font-medium mb-2 block">State</label>
                        <Select value={profile.state} onValueChange={(value) => setProfile({...profile, state: value})}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select state" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="NSW">New South Wales</SelectItem>
                            <SelectItem value="VIC">Victoria</SelectItem>
                            <SelectItem value="QLD">Queensland</SelectItem>
                            <SelectItem value="WA">Western Australia</SelectItem>
                            <SelectItem value="SA">South Australia</SelectItem>
                            <SelectItem value="TAS">Tasmania</SelectItem>
                            <SelectItem value="ACT">Australian Capital Territory</SelectItem>
                            <SelectItem value="NT">Northern Territory</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm font-medium mb-2 block">Company</label>
                        <Input 
                          value={profile.company} 
                          onChange={(e) => setProfile({...profile, company: e.target.value})}
                          placeholder="Your company name"
                        />
                      </div>
                      <div>
                        <label className="text-sm font-medium mb-2 block">Website</label>
                        <Input 
                          value={profile.website} 
                          onChange={(e) => setProfile({...profile, website: e.target.value})}
                          placeholder="https://yourwebsite.com"
                          type="url"
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm font-medium mb-2 block">Time Commitment</label>
                        <Select value={profile.time_commitment} onValueChange={(value) => setProfile({...profile, time_commitment: value})}>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="full-time">Full-time</SelectItem>
                            <SelectItem value="part-time">Part-time</SelectItem>
                            <SelectItem value="weekends">Weekends only</SelectItem>
                            <SelectItem value="flexible">Flexible</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <label className="text-sm font-medium mb-2 block">Indicative Ticket Size</label>
                        <Select value={profile.indicative_ticket} onValueChange={(value) => setProfile({...profile, indicative_ticket: value})}>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="$1k-$5k">$1k - $5k</SelectItem>
                            <SelectItem value="$5k-$25k">$5k - $25k</SelectItem>
                            <SelectItem value="$25k-$100k">$25k - $100k</SelectItem>
                            <SelectItem value="$100k+">$100k+</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Sectors & Skills */}
                <Card className="bg-white/70">
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Briefcase className="h-5 w-5 mr-2 text-green-500" />
                      Sectors & Skills
                    </CardTitle>
                    <CardDescription>What industries and skills do you focus on?</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <label className="text-sm font-medium mb-2 block">Sectors of Interest</label>
                      <div className="flex flex-wrap gap-2">
                        {["Sustainability", "Technology", "Healthcare", "Education", "Finance", "Retail", "Manufacturing", "Food & Beverage", "Transportation", "Real Estate"].map((sector) => (
                          <Badge 
                            key={sector}
                            variant={profile.sectors.includes(sector) ? "default" : "outline"}
                            className="cursor-pointer hover:bg-primary/10"
                            onClick={() => {
                              const newSectors = profile.sectors.includes(sector)
                                ? profile.sectors.filter(s => s !== sector)
                                : [...profile.sectors, sector]
                              setProfile({...profile, sectors: newSectors})
                            }}
                          >
                            {sector}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    <div>
                      <label className="text-sm font-medium mb-2 block">Skills</label>
                      <div className="flex flex-wrap gap-2">
                        {["Design", "Development", "Marketing", "Sales", "Product Management", "Finance", "Operations", "Legal", "Data Analysis", "Customer Support", "Content Creation", "Project Management"].map((skill) => (
                          <Badge 
                            key={skill}
                            variant={profile.skills.includes(skill) ? "default" : "outline"}
                            className="cursor-pointer hover:bg-primary/10"
                            onClick={() => {
                              const newSkills = profile.skills.includes(skill)
                                ? profile.skills.filter(s => s !== skill)
                                : [...profile.skills, skill]
                              setProfile({...profile, skills: newSkills})
                            }}
                          >
                            {skill}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Social Links */}
                <Card className="bg-white/70">
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <LinkIcon className="h-5 w-5 mr-2 text-purple-500" />
                      Social Links
                    </CardTitle>
                    <CardDescription>Connect your social profiles</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm font-medium mb-2 block">LinkedIn</label>
                        <Input 
                          value={profile.social_links.linkedin} 
                          onChange={(e) => setProfile({
                            ...profile, 
                            social_links: {...profile.social_links, linkedin: e.target.value}
                          })}
                          placeholder="https://linkedin.com/in/username"
                          type="url"
                        />
                      </div>
                      <div>
                        <label className="text-sm font-medium mb-2 block">Twitter</label>
                        <Input 
                          value={profile.social_links.twitter} 
                          onChange={(e) => setProfile({
                            ...profile, 
                            social_links: {...profile.social_links, twitter: e.target.value}
                          })}
                          placeholder="https://twitter.com/username"
                          type="url"
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm font-medium mb-2 block">Instagram</label>
                        <Input 
                          value={profile.social_links.instagram} 
                          onChange={(e) => setProfile({
                            ...profile, 
                            social_links: {...profile.social_links, instagram: e.target.value}
                          })}
                          placeholder="https://instagram.com/username"
                          type="url"
                        />
                      </div>
                      <div>
                        <label className="text-sm font-medium mb-2 block">Personal Website</label>
                        <Input 
                          value={profile.social_links.website} 
                          onChange={(e) => setProfile({
                            ...profile, 
                            social_links: {...profile.social_links, website: e.target.value}
                          })}
                          placeholder="https://yourwebsite.com"
                          type="url"
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Profile Preview */}
              <div className="space-y-6">
                <Card className="bg-white/70">
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <CheckCircle className="h-5 w-5 mr-2 text-green-500" />
                      Profile Preview
                    </CardTitle>
                    <CardDescription>How others will see your profile</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="text-center">
                      <div className="w-20 h-20 bg-gradient-to-br from-[#21C087] to-[#1BA876] rounded-full mx-auto mb-3 flex items-center justify-center">
                        <User className="h-8 w-8 text-white" />
                      </div>
                      <h3 className="font-semibold">{profile.full_name || "Your Name"}</h3>
                      <p className="text-sm text-muted-foreground capitalize">{profile.role}</p>
                      <Badge className="mt-2 bg-[#F5B800] text-[#0B1E3C] font-semibold">Active</Badge>
                    </div>
                    <div className="text-sm space-y-2">
                      {profile.location && (
                        <div className="flex items-center">
                          <MapPin className="h-4 w-4 mr-2 text-muted-foreground" />
                          {profile.location}
                        </div>
                      )}
                      {profile.sectors.length > 0 && (
                        <div>
                          <span className="font-medium">Sectors:</span> {profile.sectors.join(", ")}
                        </div>
                      )}
                      {profile.skills.length > 0 && (
                        <div>
                          <span className="font-medium">Skills:</span> {profile.skills.join(", ")}
                        </div>
                      )}
                      {profile.bio && (
                        <div>
                          <span className="font-medium">Bio:</span> {profile.bio.substring(0, 100)}{profile.bio.length > 100 ? "..." : ""}
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-white/70">
                  <CardHeader>
                    <CardTitle>Profile Tips</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3 text-sm text-muted-foreground">
                    <p>• Add a clear bio to help others understand your background</p>
                    <p>• Select relevant sectors and skills to improve matching</p>
                    <p>• Connect your social profiles for better networking</p>
                    <p>• Keep your location updated for local opportunities</p>
                    <p>• Complete your profile to increase visibility</p>
                  </CardContent>
                </Card>
              </div>
            </div>

            <div className="mt-8">
              <LegalNotice />
            </div>
          </main>
        </div>
      </SignedIn>
    </>
  )
}
