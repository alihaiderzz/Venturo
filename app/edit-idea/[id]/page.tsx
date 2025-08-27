"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Loader2, ArrowLeft, Save, Trash2 } from "lucide-react"
import Link from "next/link"
import { useToast } from "@/hooks/use-toast"

interface StartupIdea {
  id: string
  title: string
  one_liner: string
  description: string
  category: string
  stage: string
  needs: Record<string, any>
  links: Record<string, any>
  tags: string[]
  created_at: string
  updated_at: string
}

const categories = ["Technology", "Sustainability", "Healthcare", "Education", "Finance", "Retail", "Manufacturing", "Other"]
const stages = ["Idea", "MVP", "Early Revenue", "Growth", "Established"]

export default function EditIdeaPage() {
  const params = useParams()
  const router = useRouter()
  const { toast } = useToast()
  const ideaId = params.id as string
  
  const [idea, setIdea] = useState<StartupIdea | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState("")
  
  const [formData, setFormData] = useState({
    title: "",
    one_liner: "",
    description: "",
    category: "",
    stage: "",
    needs: {},
    links: {},
    tags: []
  })

  useEffect(() => {
    if (ideaId) {
      fetchIdea()
    }
  }, [ideaId])

  const fetchIdea = async () => {
    try {
      setLoading(true)
      const response = await fetch(`/api/user-ideas/${ideaId}`)
      
      if (response.ok) {
        const data = await response.json()
        setIdea(data.data)
        setFormData({
          title: data.data.title || "",
          one_liner: data.data.one_liner || "",
          description: data.data.description || "",
          category: data.data.category || "",
          stage: data.data.stage || "",
          needs: data.data.needs || {},
          links: data.data.links || {},
          tags: data.data.tags || []
        })
      } else {
        const errorData = await response.json()
        setError(errorData.error || "Failed to load idea")
        toast({
          title: "Error",
          description: errorData.error || "Failed to load idea",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Error fetching idea:", error)
      setError("Failed to load idea")
      toast({
        title: "Error",
        description: "Failed to load idea",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleSave = async () => {
    if (!formData.title || !formData.one_liner || !formData.category) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      })
      return
    }

    setSaving(true)
    try {
      const response = await fetch(`/api/user-ideas/${ideaId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      })

      if (response.ok) {
        toast({
          title: "Success",
          description: "Idea updated successfully!",
        })
        router.push("/browse")
      } else {
        const errorData = await response.json()
        toast({
          title: "Error",
          description: errorData.error || "Failed to update idea",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Error updating idea:", error)
      toast({
        title: "Error",
        description: "Failed to update idea",
        variant: "destructive",
      })
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this idea? This action cannot be undone.")) {
      return
    }

    try {
      const response = await fetch(`/api/user-ideas/${ideaId}`, {
        method: "DELETE",
      })

      if (response.ok) {
        toast({
          title: "Success",
          description: "Idea deleted successfully!",
        })
        router.push("/browse")
      } else {
        const errorData = await response.json()
        toast({
          title: "Error",
          description: errorData.error || "Failed to delete idea",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Error deleting idea:", error)
      toast({
        title: "Error",
        description: "Failed to delete idea",
        variant: "destructive",
      })
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F6F7F9] flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin text-[#21C087] mx-auto mb-4" />
          <p className="text-gray-600">Loading idea...</p>
        </div>
      </div>
    )
  }

  if (error || !idea) {
    return (
      <div className="min-h-screen bg-[#F6F7F9] flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Idea Not Found</h1>
          <p className="text-gray-600 mb-4">{error || "This idea does not exist or you don't have permission to edit it."}</p>
          <Link href="/browse">
            <Button className="bg-[#21C087] hover:bg-[#1BA876]">
              Back to Browse
            </Button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#F6F7F9]">
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="sm" asChild>
              <Link href="/browse">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Browse
              </Link>
            </Button>
            <div>
              <h1 className="text-3xl font-bold">Edit Startup Idea</h1>
              <p className="text-muted-foreground">Update your startup idea details</p>
            </div>
          </div>
          <Button 
            variant="destructive" 
            onClick={handleDelete}
            className="flex items-center gap-2"
          >
            <Trash2 className="h-4 w-4" />
            Delete Idea
          </Button>
        </div>

        {/* Edit Form */}
        <Card>
          <CardHeader>
            <CardTitle>Idea Details</CardTitle>
            <CardDescription>
              Update your startup idea information
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Title */}
            <div>
              <Label htmlFor="title">Title *</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => setFormData({...formData, title: e.target.value})}
                placeholder="Your startup idea title"
                className="mt-1"
              />
            </div>

            {/* One Liner */}
            <div>
              <Label htmlFor="one_liner">One Liner *</Label>
              <Input
                id="one_liner"
                value={formData.one_liner}
                onChange={(e) => setFormData({...formData, one_liner: e.target.value})}
                placeholder="Brief description of your idea"
                className="mt-1"
              />
            </div>

            {/* Description */}
            <div>
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
                placeholder="Detailed description of your startup idea"
                rows={4}
                className="mt-1"
              />
            </div>

            {/* Category and Stage */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                <Label htmlFor="stage">Stage</Label>
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

            {/* Action Buttons */}
            <div className="flex justify-end gap-3 pt-6">
              <Button variant="outline" asChild>
                <Link href="/browse">
                  Cancel
                </Link>
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
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
