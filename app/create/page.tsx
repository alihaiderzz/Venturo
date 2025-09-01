"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Upload, Target, Users, DollarSign, MessageCircle, CheckCircle, Loader2, Plus, X } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import Link from "next/link"
import { SignedIn, SignedOut, RedirectToSignIn } from "@clerk/nextjs"

const categories = [
  "Technology",
  "Healthcare",
  "Education",
  "Sustainability",
  "Finance",
  "Entertainment",
  "Food & Beverage",
  "Transportation",
  "Real Estate",
  "Other"
]

const stages = [
  "Idea",
  "MVP",
  "Early Traction",
  "Growth",
  "Scale"
]

export default function CreateListingPage() {
  return (
    <>
      <SignedOut>
        <RedirectToSignIn />
      </SignedOut>
      <SignedIn>
        <CreateListingContent />
      </SignedIn>
    </>
  )
}

function CreateListingContent() {
  const { toast } = useToast()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    title: "",
    oneLiner: "",
    description: "",
    category: "",
    stage: "",
    needs: {
      capital: false,
      skills: false,
      mentor: false,
      capital_text: "",
      skills_text: "",
      mentor_text: ""
    },
    location: "",
    website: "",
    socialMedia: []
  })

  const addSocialMedia = () => {
    setFormData({
      ...formData,
      socialMedia: [...formData.socialMedia, { platform: "", link: "" }]
    })
  }

  const removeSocialMedia = (index: number) => {
    setFormData({
      ...formData,
      socialMedia: formData.socialMedia.filter((_, i) => i !== index)
    })
  }

  const updateSocialMedia = (index: number, field: string, value: string) => {
    const updatedSocialMedia = [...formData.socialMedia]
    updatedSocialMedia[index] = { ...updatedSocialMedia[index], [field]: value }
    setFormData({
      ...formData,
      socialMedia: updatedSocialMedia
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.title || !formData.oneLiner || !formData.category) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      })
      return
    }

    setLoading(true)
    try {
      const { website, socialMedia, ...formDataWithoutLinks } = formData
      const response = await fetch('/api/upload-idea', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formDataWithoutLinks,
          one_liner: formData.oneLiner, // Fix field mapping
          links: {
            website: website,
            social_media: socialMedia
          }
        }),
      })

      if (response.ok) {
        toast({
          title: "Success!",
          description: "Your startup idea has been uploaded successfully! 🎉",
        })
        // Reset form
        setFormData({
          title: "",
          oneLiner: "",
          description: "",
          category: "",
          stage: "",
          needs: {
            capital: false,
            skills: false,
            mentor: false,
            capital_text: "",
            skills_text: "",
            mentor_text: ""
          },
          location: "",
          website: "",
          socialMedia: []
        })
      } else {
        const error = await response.json()
        toast({
          title: "Error",
          description: error.error || "Failed to upload idea",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Error uploading idea:", error)
      toast({
        title: "Error",
        description: "Failed to upload idea. Please try again.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <div className="max-w-4xl mx-auto px-4 py-6 sm:py-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center space-y-4 sm:space-y-0 sm:space-x-4 mb-6 sm:mb-8">
          <Button variant="ghost" size="sm" asChild className="self-start">
            <Link href="/">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Home
            </Link>
          </Button>
          <div className="flex-1">
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Upload Your Idea
            </h1>
            <p className="text-muted-foreground text-base sm:text-lg">
              Share your startup idea with Australia's entrepreneurial community
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6 sm:space-y-8">
          {/* Basic Information */}
          <Card className="bg-white/70">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="h-5 w-5 text-blue-500" />
                Basic Information
              </CardTitle>
              <CardDescription>
                Tell us about your startup idea
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <Label htmlFor="title">Startup Name *</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData({...formData, title: e.target.value})}
                  placeholder="Enter your startup name"
                  className="mt-1"
                />
              </div>

              <div>
                <Label htmlFor="oneLiner">One-Liner Description *</Label>
                <Input
                  id="oneLiner"
                  value={formData.oneLiner}
                  onChange={(e) => setFormData({...formData, oneLiner: e.target.value})}
                  placeholder="Brief description of your idea"
                  className="mt-1"
                />
              </div>

              <div>
                <Label htmlFor="description">Detailed Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  placeholder="Tell us more about your idea, vision, and goals"
                  rows={4}
                  className="mt-1"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="category">Category *</Label>
                  <Select value={formData.category} onValueChange={(value) => setFormData({...formData, category: value})}>
                    <SelectTrigger className="mt-1">
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((category) => (
                        <SelectItem key={category} value={category}>
                          {category}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="stage">Development Stage</Label>
                  <Select value={formData.stage} onValueChange={(value) => setFormData({...formData, stage: value})}>
                    <SelectTrigger className="mt-1">
                      <SelectValue placeholder="Select stage" />
                    </SelectTrigger>
                    <SelectContent>
                      {stages.map((stage) => (
                        <SelectItem key={stage} value={stage}>
                          {stage}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* What You Need */}
          <Card className="bg-white/70">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5 text-green-500" />
                What You Need
              </CardTitle>
              <CardDescription>
                Let potential collaborators know what you're looking for
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="needs_capital"
                    checked={formData.needs.capital}
                    onChange={(e) => setFormData({
                      ...formData, 
                      needs: {...formData.needs, capital: e.target.checked}
                    })}
                    className="rounded"
                  />
                  <Label htmlFor="needs_capital" className="flex items-center gap-2">
                    <DollarSign className="h-4 w-4 text-green-500" />
                    Capital
                  </Label>
                </div>

                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="needs_skills"
                    checked={formData.needs.skills}
                    onChange={(e) => setFormData({
                      ...formData, 
                      needs: {...formData.needs, skills: e.target.checked}
                    })}
                    className="rounded"
                  />
                  <Label htmlFor="needs_skills" className="flex items-center gap-2">
                    <Users className="h-4 w-4 text-blue-500" />
                    Skills
                  </Label>
                </div>

                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="needs_mentor"
                    checked={formData.needs.mentor}
                    onChange={(e) => setFormData({
                      ...formData, 
                      needs: {...formData.needs, mentor: e.target.checked}
                    })}
                    className="rounded"
                  />
                  <Label htmlFor="needs_mentor" className="flex items-center gap-2">
                    <MessageCircle className="h-4 w-4 text-purple-500" />
                    Mentorship
                  </Label>
                </div>
              </div>

              {formData.needs.capital && (
                <div>
                  <Label htmlFor="capital_text">Capital Requirements</Label>
                  <Input
                    id="capital_text"
                    value={formData.needs.capital_text}
                    onChange={(e) => setFormData({
                      ...formData, 
                      needs: {...formData.needs, capital_text: e.target.value}
                    })}
                    placeholder="e.g., Seeking $50K for MVP development"
                    className="mt-1"
                  />
                </div>
              )}

              {formData.needs.skills && (
                <div>
                  <Label htmlFor="skills_text">Skills Needed</Label>
                  <Input
                    id="skills_text"
                    value={formData.needs.skills_text}
                    onChange={(e) => setFormData({
                      ...formData, 
                      needs: {...formData.needs, skills_text: e.target.value}
                    })}
                    placeholder="e.g., Looking for a technical co-founder"
                    className="mt-1"
                  />
                </div>
              )}

              {formData.needs.mentor && (
                <div>
                  <Label htmlFor="mentor_text">Mentorship Needs</Label>
                  <Input
                    id="mentor_text"
                    value={formData.needs.mentor_text}
                    onChange={(e) => setFormData({
                      ...formData, 
                      needs: {...formData.needs, mentor_text: e.target.value}
                    })}
                    placeholder="e.g., Seeking guidance on go-to-market strategy"
                    className="mt-1"
                  />
                </div>
              )}
            </CardContent>
          </Card>

          {/* Contact Information */}
          <Card className="bg-white/70">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MessageCircle className="h-5 w-5 text-purple-500" />
                Contact Information
              </CardTitle>
              <CardDescription>
                Help people connect with you
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="location">Location</Label>
                  <Input
                    id="location"
                    value={formData.location}
                    onChange={(e) => setFormData({...formData, location: e.target.value})}
                    placeholder="e.g., Sydney, NSW"
                    className="mt-1"
                  />
                </div>

                <div>
                  <Label htmlFor="website">Website</Label>
                  <Input
                    id="website"
                    value={formData.website}
                    onChange={(e) => setFormData({...formData, website: e.target.value})}
                    placeholder="yourstartup.com"
                    className="mt-1"
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-4">
                  <Label>Social Media Links</Label>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={addSocialMedia}
                    className="flex items-center gap-2"
                  >
                    <Plus className="h-4 w-4" />
                    Add Platform
                  </Button>
                </div>
                
                {formData.socialMedia.length === 0 ? (
                  <div className="text-center py-6 text-muted-foreground border-2 border-dashed rounded-lg">
                    <p>No social media links added yet</p>
                    <p className="text-sm">Click "Add Platform" to get started</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {formData.socialMedia.map((social, index) => (
                      <div key={index} className="flex items-center gap-3">
                        <div className="flex-1">
                          <Input
                            placeholder="Platform (e.g., LinkedIn, Twitter, Instagram)"
                            value={social.platform}
                            onChange={(e) => updateSocialMedia(index, "platform", e.target.value)}
                            className="mb-2"
                          />
                          <Input
                            placeholder="Link to your profile"
                            value={social.link}
                            onChange={(e) => updateSocialMedia(index, "link", e.target.value)}
                          />
                        </div>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => removeSocialMedia(index)}
                          className="text-red-500 hover:text-red-700"
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Submit Button */}
          <div className="flex justify-center pt-4">
            <Button 
              type="submit" 
              size="lg" 
              disabled={loading}
              className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white px-6 sm:px-8 py-3 sm:py-4 text-base sm:text-lg shadow-lg hover:shadow-xl transition-all duration-200 w-full sm:w-auto"
            >
              {loading ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin mr-2" />
                  Uploading...
                </>
              ) : (
                <>
                  <Upload className="h-5 w-5 mr-2" />
                  Upload Your Idea
                </>
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}

