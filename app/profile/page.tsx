"use client"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Save, User, MapPin, Briefcase, Globe, Link as LinkIcon } from "lucide-react"
import Link from "next/link"
import { LegalNotice } from "@/components/LegalNotice"
import { SignedIn, SignedOut, RedirectToSignIn } from "@clerk/nextjs"

export default function ProfilePage() {
  const [profile, setProfile] = useState({
    name: "Sarah Chen",
    role: "founder",
    bio: "Passionate founder building sustainable solutions for the future.",
    state: "NSW",
    sectors: ["Sustainability", "Technology"],
    skills: ["Design", "Product Management"],
    interests: ["Sustainability", "Delivery"],
    timeCommitment: "part-time",
    indicativeTicket: "$5k-$25k",
    social: {
      linkedin: "https://linkedin.com/in/sarah",
      twitter: "",
      instagram: "https://instagram.com/sarah_eco",
      website: ""
    }
  })

  const handleSave = async () => {
    try {
      const res = await fetch("/api/user-profile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(profile),
      })

      if (res.ok) {
        const result = await res.json()
        console.log("Profile saved successfully!", result)
        alert("Profile saved successfully!")
      } else {
        const errorData = await res.json()
        console.error("Failed to save profile:", errorData.error)
        alert("Failed to save profile: " + errorData.error)
      }
    } catch (error) {
      console.error("Error saving profile:", error)
      alert("Error saving profile. Please try again.")
    }
  }

  return (
    <>
      <SignedOut>
        <RedirectToSignIn />
      </SignedOut>
      <SignedIn>
        <div className="min-h-screen bg-background">
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
                <Button onClick={handleSave} className="bg-[#21C087] hover:bg-[#1a9f6f]">
                  <Save className="h-4 w-4 mr-2" />
                  Save Changes
                </Button>
              </div>
            </div>
          </header>

          <main className="container mx-auto px-4 py-8">
            <div className="grid gap-6 lg:grid-cols-3">
              {/* Main Profile Form */}
              <div className="lg:col-span-2 space-y-6">
                {/* Basic Information */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <User className="h-5 w-5 mr-2" />
                      Basic Information
                    </CardTitle>
                    <CardDescription>Your personal and professional details</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm font-medium mb-2 block">Full Name</label>
                        <Input 
                          value={profile.name} 
                          onChange={(e) => setProfile({...profile, name: e.target.value})}
                          placeholder="Your full name"
                        />
                      </div>
                      <div>
                        <label className="text-sm font-medium mb-2 block">Role</label>
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
                        <Select value={profile.state} onValueChange={(value) => setProfile({...profile, state: value})}>
                          <SelectTrigger>
                            <SelectValue />
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
                      <div>
                        <label className="text-sm font-medium mb-2 block">Time Commitment</label>
                        <Select value={profile.timeCommitment} onValueChange={(value) => setProfile({...profile, timeCommitment: value})}>
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
                    </div>
                  </CardContent>
                </Card>

                {/* Sectors & Skills */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Briefcase className="h-5 w-5 mr-2" />
                      Sectors & Skills
                    </CardTitle>
                    <CardDescription>What industries and skills do you focus on?</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <label className="text-sm font-medium mb-2 block">Sectors of Interest</label>
                      <div className="flex flex-wrap gap-2">
                        {["Sustainability", "Technology", "Healthcare", "Education", "Finance", "Retail", "Manufacturing"].map((sector) => (
                          <Badge 
                            key={sector}
                            variant={profile.sectors.includes(sector) ? "default" : "outline"}
                            className="cursor-pointer"
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
                        {["Design", "Development", "Marketing", "Sales", "Product Management", "Finance", "Operations", "Legal"].map((skill) => (
                          <Badge 
                            key={skill}
                            variant={profile.skills.includes(skill) ? "default" : "outline"}
                            className="cursor-pointer"
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
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <LinkIcon className="h-5 w-5 mr-2" />
                      Social Links
                    </CardTitle>
                    <CardDescription>Connect your social profiles</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm font-medium mb-2 block">LinkedIn</label>
                        <Input 
                          value={profile.social.linkedin} 
                          onChange={(e) => setProfile({
                            ...profile, 
                            social: {...profile.social, linkedin: e.target.value}
                          })}
                          placeholder="https://linkedin.com/in/username"
                        />
                      </div>
                      <div>
                        <label className="text-sm font-medium mb-2 block">Twitter</label>
                        <Input 
                          value={profile.social.twitter} 
                          onChange={(e) => setProfile({
                            ...profile, 
                            social: {...profile.social, twitter: e.target.value}
                          })}
                          placeholder="https://twitter.com/username"
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm font-medium mb-2 block">Instagram</label>
                        <Input 
                          value={profile.social.instagram} 
                          onChange={(e) => setProfile({
                            ...profile, 
                            social: {...profile.social, instagram: e.target.value}
                          })}
                          placeholder="https://instagram.com/username"
                        />
                      </div>
                      <div>
                        <label className="text-sm font-medium mb-2 block">Website</label>
                        <Input 
                          value={profile.social.website} 
                          onChange={(e) => setProfile({
                            ...profile, 
                            social: {...profile.social, website: e.target.value}
                          })}
                          placeholder="https://yourwebsite.com"
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Profile Preview */}
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Profile Preview</CardTitle>
                    <CardDescription>How others will see your profile</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="text-center">
                      <div className="w-20 h-20 bg-[#21C087] rounded-full mx-auto mb-3 flex items-center justify-center">
                        <User className="h-8 w-8 text-white" />
                      </div>
                      <h3 className="font-semibold">{profile.name}</h3>
                      <p className="text-sm text-muted-foreground capitalize">{profile.role}</p>
                      <Badge className="mt-2 bg-[#F5B800] text-[#0B1E3C] font-semibold">Pro</Badge>
                    </div>
                    <div className="text-sm space-y-2">
                      <div className="flex items-center">
                        <MapPin className="h-4 w-4 mr-2 text-muted-foreground" />
                        {profile.state}
                      </div>
                      <div>
                        <span className="font-medium">Sectors:</span> {profile.sectors.join(", ")}
                      </div>
                      <div>
                        <span className="font-medium">Skills:</span> {profile.skills.join(", ")}
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Profile Tips</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3 text-sm text-muted-foreground">
                    <p>• Add a clear bio to help others understand your background</p>
                    <p>• Select relevant sectors and skills to improve matching</p>
                    <p>• Connect your social profiles for better networking</p>
                    <p>• Keep your location updated for local opportunities</p>
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
