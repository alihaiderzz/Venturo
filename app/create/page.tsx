"use client"
import { useState } from "react"
import { useUser } from "@clerk/nextjs"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { LegalNotice } from "@/components/LegalNotice"
import { ArrowLeft, Save, Sparkles, Upload, Link as LinkIcon, Target, TrendingUp } from "lucide-react"
import Link from "next/link"
import { SignedIn, SignedOut, RedirectToSignIn } from "@clerk/nextjs"

export default function CreateListingPage() {
  const { user } = useUser()
  const [formData, setFormData] = useState({
    title: "",
    oneLiner: "",
    category: "",
    stage: "",
    state: "",
    problem: "",
    solution: "",
    traction: "",
    needs: {
      capital: "",
      skills: "",
      mentor: ""
    },
    milestones: [""],
    links: {
      website: "",
      deck: ""
    },
    tags: [],
    images: [],
    company_logo: "",
    company_logo_public_id: ""
  })

  const [uploadingImage, setUploadingImage] = useState(false)

  const [currentStep, setCurrentStep] = useState(1)
  const [isGenerating, setIsGenerating] = useState(false)

  const categories = ["Technology", "Sustainability", "Healthcare", "Education", "Finance", "Retail", "Manufacturing", "Other"]
  const stages = ["Idea", "MVP", "Early Revenue", "Growth", "Established"]
  const states = ["NSW", "VIC", "QLD", "WA", "SA", "TAS", "ACT", "NT"]
  const availableTags = ["AI/ML", "SaaS", "Mobile App", "E-commerce", "Fintech", "Edtech", "Healthtech", "Clean Energy", "Social Impact", "B2B", "B2C"]

  const handleImageUpload = async (file: File, type: 'logo' | 'image') => {
    setUploadingImage(true)
    try {
      const formData = new FormData()
      formData.append('file', file)

      const res = await fetch('/api/upload-image', {
        method: 'POST',
        body: formData
      })

      if (res.ok) {
        const data = await res.json()
        if (type === 'logo') {
          setFormData(prev => ({ 
            ...prev, 
            company_logo: data.url,
            company_logo_public_id: data.public_id
          }))
        } else {
          setFormData(prev => ({ 
            ...prev, 
            images: [...prev.images, {
              url: data.url,
              public_id: data.public_id,
              width: data.width,
              height: data.height
            }]
          }))
        }
        alert('Image uploaded successfully!')
      } else {
        const error = await res.json()
        alert(`Upload failed: ${error.error}`)
      }
    } catch (error) {
      console.error('Upload error:', error)
      alert('Upload failed. Please try again.')
    } finally {
      setUploadingImage(false)
    }
  }

  const removeImage = async (index: number, type: 'logo' | 'image') => {
    if (type === 'logo') {
      // Delete logo from Cloudinary if it exists
      if (formData.company_logo_public_id) {
        try {
          await fetch('/api/delete-image', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ public_id: formData.company_logo_public_id })
          })
        } catch (error) {
          console.error('Error deleting logo:', error)
        }
      }
      
      setFormData(prev => ({ 
        ...prev, 
        company_logo: "",
        company_logo_public_id: ""
      }))
    } else {
      // Delete image from Cloudinary if it exists
      const imageToDelete = formData.images[index]
      if (imageToDelete?.public_id) {
        try {
          await fetch('/api/delete-image', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ public_id: imageToDelete.public_id })
          })
        } catch (error) {
          console.error('Error deleting image:', error)
        }
      }
      
      setFormData(prev => ({ 
        ...prev, 
        images: prev.images.filter((_, i) => i !== index) 
      }))
    }
  }

  async function generatePitch() {
    setIsGenerating(true)
    try {
      const res = await fetch("/api/pitch-copilot", { 
        method: "POST", 
        headers: { "Content-Type": "application/json" }, 
        body: JSON.stringify({ notes: formData.problem }) 
      })
      const data = await res.json()
      setFormData({
        ...formData,
        oneLiner: data.pitch.oneLiner,
        problem: data.pitch.problem,
        solution: data.pitch.solution
      })
    } catch (error) {
      console.error("Error generating pitch:", error)
    } finally {
      setIsGenerating(false)
    }
  }

  const handleSave = async () => {
    if (!user) {
      console.error("User not authenticated")
      return
    }

    try {
      const res = await fetch("/api/upload-idea", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: formData.title,
          one_liner: formData.oneLiner,
          description: formData.solution || formData.oneLiner,
          category: formData.category,
          stage: formData.stage,
          needs: formData.needs,
          links: formData.links,
          tags: formData.tags,
          images: formData.images,
          company_logo: formData.company_logo,
          company_logo_public_id: formData.company_logo_public_id
        }),
      })

      if (res.ok) {
        const result = await res.json()
        console.log("Idea saved successfully!", result)
        alert("Your startup idea has been published successfully!")
        // Redirect to the individual idea page
        window.location.href = `/idea/${result.idea.id}`
      } else {
        const errorData = await res.json()
        console.error("Failed to save idea:", errorData.error)
        
        if (errorData.limitReached) {
          alert(`Limit reached: ${errorData.error}\n\nYou have posted ${errorData.currentIdeas} of ${errorData.maxIdeas} allowed ideas.`)
        } else {
          alert("Failed to save idea: " + errorData.error)
        }
      }
    } catch (error) {
      console.error("Error saving idea:", error)
      alert("Error saving idea. Please try again.")
    }
  }

  const addMilestone = () => {
    setFormData({
      ...formData,
      milestones: [...formData.milestones, ""]
    })
  }

  const removeMilestone = (index: number) => {
    setFormData({
      ...formData,
      milestones: formData.milestones.filter((_, i) => i !== index)
    })
  }

  const updateMilestone = (index: number, value: string) => {
    const newMilestones = [...formData.milestones]
    newMilestones[index] = value
    setFormData({
      ...formData,
      milestones: newMilestones
    })
  }

  const toggleTag = (tag: string) => {
    const newTags = formData.tags.includes(tag)
      ? formData.tags.filter(t => t !== tag)
      : [...formData.tags, tag]
    setFormData({
      ...formData,
      tags: newTags
    })
  }

  return (
    <>
      <SignedOut>
        <RedirectToSignIn />
      </SignedOut>
      <SignedIn>
        <main className="container mx-auto px-4 py-8">
          <div className="mb-6"><LegalNotice /></div>
          
          {/* Header */}
          <div className="flex items-center space-x-4 mb-6">
            <Button variant="ghost" size="sm" asChild>
              <Link href="/" aria-label="Back to home">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back
              </Link>
            </Button>
            <h1 className="text-3xl font-bold">Create New Listing</h1>
          </div>

          {/* Progress Steps */}
          <div className="mb-8">
            <div className="flex items-center space-x-4">
              {[1, 2, 3, 4].map((step) => (
                <div key={step} className="flex items-center">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                    currentStep >= step ? 'bg-[#21C087] text-white' : 'bg-gray-200 text-gray-600'
                  }`}>
                    {step}
                  </div>
                  {step < 4 && (
                    <div className={`w-16 h-1 mx-2 ${currentStep > step ? 'bg-[#21C087]' : 'bg-gray-200'}`} />
                  )}
                </div>
              ))}
            </div>
            <div className="mt-2 text-sm text-muted-foreground">
              Step {currentStep} of 4: {currentStep === 1 ? 'Basic Info' : currentStep === 2 ? 'Problem & Solution' : currentStep === 3 ? 'Traction & Needs' : 'Final Details'}
            </div>
          </div>

          <div className="grid gap-6 lg:grid-cols-3">
            {/* Main Form */}
            <div className="lg:col-span-2 space-y-6">
              {/* Step 1: Basic Information */}
              {currentStep === 1 && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Upload className="h-5 w-5 mr-2" />
                      Basic Information
                    </CardTitle>
                    <CardDescription>Tell us about your startup</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <label className="text-sm font-medium mb-2 block">Startup Name *</label>
                      <Input 
                        value={formData.title} 
                        onChange={(e) => setFormData({...formData, title: e.target.value})}
                        placeholder="Enter your startup name"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium mb-2 block">One-liner *</label>
                      <Textarea 
                        value={formData.oneLiner} 
                        onChange={(e) => setFormData({...formData, oneLiner: e.target.value})}
                        placeholder="A brief description of what your startup does"
                        rows={2}
                      />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <label className="text-sm font-medium mb-2 block">Category *</label>
                        <Select value={formData.category} onValueChange={(value) => setFormData({...formData, category: value})}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select category" />
                          </SelectTrigger>
                          <SelectContent>
                            {categories.map((category) => (
                              <SelectItem key={category} value={category}>{category}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <label className="text-sm font-medium mb-2 block">Stage *</label>
                        <Select value={formData.stage} onValueChange={(value) => setFormData({...formData, stage: value})}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select stage" />
                          </SelectTrigger>
                          <SelectContent>
                            {stages.map((stage) => (
                              <SelectItem key={stage} value={stage}>{stage}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <label className="text-sm font-medium mb-2 block">Location *</label>
                        <Select value={formData.state} onValueChange={(value) => setFormData({...formData, state: value})}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select state" />
                          </SelectTrigger>
                          <SelectContent>
                            {states.map((state) => (
                              <SelectItem key={state} value={state}>{state}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <div>
                      <label className="text-sm font-medium mb-2 block">Tags</label>
                      <div className="flex flex-wrap gap-2">
                        {availableTags.map((tag) => (
                          <Badge 
                            key={tag}
                            variant={formData.tags.includes(tag) ? "default" : "outline"}
                            className="cursor-pointer"
                            onClick={() => toggleTag(tag)}
                          >
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    <div>
                      <label className="text-sm font-medium mb-2 block">Company Logo</label>
                      <div className="space-y-2">
                        {formData.company_logo ? (
                          <div className="relative">
                            <img 
                              src={formData.company_logo} 
                              alt="Company logo" 
                              className="w-20 h-20 object-cover rounded border"
                            />
                            <Button
                              type="button"
                              variant="destructive"
                              size="sm"
                              className="absolute -top-2 -right-2 h-6 w-6 p-0"
                              onClick={() => removeImage(0, 'logo')}
                            >
                              ×
                            </Button>
                          </div>
                        ) : (
                          <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
                            <input
                              type="file"
                              accept="image/*"
                              onChange={(e) => {
                                const file = e.target.files?.[0]
                                if (file) handleImageUpload(file, 'logo')
                              }}
                              className="hidden"
                              id="logo-upload"
                            />
                            <label htmlFor="logo-upload" className="cursor-pointer">
                              <Upload className="h-8 w-8 mx-auto mb-2 text-gray-400" />
                              <p className="text-sm text-gray-500">Click to upload company logo</p>
                            </label>
                          </div>
                        )}
                      </div>
                    </div>
                    <div>
                      <label className="text-sm font-medium mb-2 block">Additional Images</label>
                      <div className="space-y-2">
                        <div className="grid grid-cols-2 gap-2">
                          {formData.images.map((image, index) => (
                            <div key={index} className="relative">
                              <img 
                                src={image.url} 
                                alt={`Additional image ${index + 1}`} 
                                className="w-full h-24 object-cover rounded border"
                              />
                              <Button
                                type="button"
                                variant="destructive"
                                size="sm"
                                className="absolute -top-2 -right-2 h-6 w-6 p-0"
                                onClick={() => removeImage(index, 'image')}
                              >
                                ×
                              </Button>
                            </div>
                          ))}
                        </div>
                        {formData.images.length < 4 && (
                          <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
                            <input
                              type="file"
                              accept="image/*"
                              onChange={(e) => {
                                const file = e.target.files?.[0]
                                if (file) handleImageUpload(file, 'image')
                              }}
                              className="hidden"
                              id="image-upload"
                            />
                            <label htmlFor="image-upload" className="cursor-pointer">
                              <Upload className="h-8 w-8 mx-auto mb-2 text-gray-400" />
                              <p className="text-sm text-gray-500">Add image ({formData.images.length}/4)</p>
                            </label>
                          </div>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Step 2: Problem & Solution */}
              {currentStep === 2 && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Target className="h-5 w-5 mr-2" />
                      Problem & Solution
                    </CardTitle>
                    <CardDescription>What problem are you solving and how?</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <label className="text-sm font-medium mb-2 block">Problem Statement *</label>
                      <Textarea 
                        value={formData.problem} 
                        onChange={(e) => setFormData({...formData, problem: e.target.value})}
                        placeholder="Describe the problem you're solving"
                        rows={3}
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium mb-2 block">Solution *</label>
                      <Textarea 
                        value={formData.solution} 
                        onChange={(e) => setFormData({...formData, solution: e.target.value})}
                        placeholder="How does your startup solve this problem?"
                        rows={3}
                      />
                    </div>
                    <div className="flex justify-center">
                      <Button 
                        onClick={generatePitch} 
                        disabled={isGenerating || !formData.problem}
                        className="bg-[#21C087] hover:bg-[#1BA876]"
                      >
                        <Sparkles className="h-4 w-4 mr-2" />
                        {isGenerating ? "Generating..." : "AI Pitch Copilot"}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Step 3: Traction & Needs */}
              {currentStep === 3 && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <TrendingUp className="h-5 w-5 mr-2" />
                      Traction & Needs
                    </CardTitle>
                    <CardDescription>What have you achieved and what do you need?</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <label className="text-sm font-medium mb-2 block">Traction/Progress</label>
                      <Textarea 
                        value={formData.traction} 
                        onChange={(e) => setFormData({...formData, traction: e.target.value})}
                        placeholder="What milestones have you achieved? Users, revenue, partnerships, etc."
                        rows={3}
                      />
                    </div>
                    <div className="space-y-4">
                      <h4 className="font-medium">What do you need?</h4>
                      <div>
                        <label className="text-sm font-medium mb-2 block">Capital</label>
                        <Input 
                          value={formData.needs.capital} 
                          onChange={(e) => setFormData({
                            ...formData, 
                            needs: {...formData.needs, capital: e.target.value}
                          })}
                          placeholder="e.g., $50k for development, $100k for marketing"
                        />
                      </div>
                      <div>
                        <label className="text-sm font-medium mb-2 block">Skills/Team</label>
                        <Input 
                          value={formData.needs.skills} 
                          onChange={(e) => setFormData({
                            ...formData, 
                            needs: {...formData.needs, skills: e.target.value}
                          })}
                          placeholder="e.g., Technical co-founder, Marketing specialist"
                        />
                      </div>
                      <div>
                        <label className="text-sm font-medium mb-2 block">Mentorship</label>
                        <Input 
                          value={formData.needs.mentor} 
                          onChange={(e) => setFormData({
                            ...formData, 
                            needs: {...formData.needs, mentor: e.target.value}
                          })}
                          placeholder="e.g., Industry expert, Growth advisor"
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Step 4: Final Details */}
              {currentStep === 4 && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <LinkIcon className="h-5 w-5 mr-2" />
                      Final Details
                    </CardTitle>
                    <CardDescription>Links and milestones</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm font-medium mb-2 block">Website</label>
                        <Input 
                          value={formData.links.website} 
                          onChange={(e) => setFormData({
                            ...formData, 
                            links: {...formData.links, website: e.target.value}
                          })}
                          placeholder="https://yourstartup.com"
                        />
                      </div>
                      <div>
                        <label className="text-sm font-medium mb-2 block">Pitch Deck</label>
                        <Input 
                          value={formData.links.deck} 
                          onChange={(e) => setFormData({
                            ...formData, 
                            links: {...formData.links, deck: e.target.value}
                          })}
                          placeholder="Link to your pitch deck"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="text-sm font-medium mb-2 block">Key Milestones</label>
                      {formData.milestones.map((milestone, index) => (
                        <div key={index} className="flex gap-2 mb-2">
                          <Input 
                            value={milestone} 
                            onChange={(e) => updateMilestone(index, e.target.value)}
                            placeholder={`Milestone ${index + 1}`}
                          />
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => removeMilestone(index)}
                            disabled={formData.milestones.length === 1}
                          >
                            Remove
                          </Button>
                        </div>
                      ))}
                      <Button variant="outline" size="sm" onClick={addMilestone}>
                        Add Milestone
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Navigation */}
              <div className="flex justify-between">
                <Button 
                  variant="outline" 
                  onClick={() => setCurrentStep(Math.max(1, currentStep - 1))}
                  disabled={currentStep === 1}
                >
                  Previous
                </Button>
                {currentStep < 4 ? (
                  <Button 
                    onClick={() => setCurrentStep(currentStep + 1)}
                    className="bg-[#21C087] hover:bg-[#1BA876]"
                  >
                    Next
                  </Button>
                ) : (
                  <Button 
                    onClick={handleSave}
                    className="bg-[#21C087] hover:bg-[#1BA876]"
                  >
                    <Save className="h-4 w-4 mr-2" />
                    Publish Listing
                  </Button>
                )}
              </div>
            </div>

            {/* Preview Sidebar */}
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Preview</CardTitle>
                  <CardDescription>How your listing will appear</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {formData.title && (
                    <div>
                      <h3 className="font-semibold">{formData.title}</h3>
                      <p className="text-sm text-muted-foreground">{formData.oneLiner}</p>
                      <div className="flex flex-wrap gap-1 mt-2">
                        {formData.category && <Badge variant="outline">{formData.category}</Badge>}
                        {formData.stage && <Badge variant="outline">{formData.stage}</Badge>}
                        {formData.state && <Badge variant="outline">{formData.state}</Badge>}
                      </div>
                    </div>
                  )}
                  {!formData.title && (
                    <p className="text-sm text-muted-foreground">Start filling out the form to see a preview</p>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Tips</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3 text-sm text-muted-foreground">
                  <p>• Be specific about the problem you're solving</p>
                  <p>• Include concrete traction metrics when possible</p>
                  <p>• Clearly state what you need (capital, skills, mentorship)</p>
                  <p>• Add relevant tags to improve discoverability</p>
                  <p>• Include links to your website and pitch deck</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Legal Notice</CardTitle>
                </CardHeader>
                <CardContent className="text-sm text-muted-foreground">
                  <p>All deals and investments occur off-platform between users. Venturo is a networking platform and does not arrange or execute investments.</p>
                </CardContent>
              </Card>
            </div>
          </div>
        </main>
      </SignedIn>
    </>
  )
}

