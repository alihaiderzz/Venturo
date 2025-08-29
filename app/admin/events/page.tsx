"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { 
  Loader2, 
  Plus, 
  Edit, 
  Trash2, 
  Calendar, 
  MapPin, 
  Users, 
  ExternalLink, 
  CheckCircle, 
  ArrowLeft, 
  Rocket,
  Crown,
  Shield,
  TrendingUp,
  PartyPopper
} from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import Link from "next/link"

interface Event {
  id: string
  title: string
  description: string
  date: string
  time_start: string
  time_end: string
  location: string
  category: string
  max_attendees: number
  current_attendees: number
  is_venturo_hosted: boolean
  status: 'upcoming' | 'ongoing' | 'completed' | 'cancelled'
  organizer_name: string
  organizer_email: string
  external_link: string
  created_at: string
  updated_at: string
}

const categories = ["Networking", "Workshop", "Pitch Competition", "Conference", "Meetup", "Hackathon", "Other"]

export default function AdminEventsPage() {
  return <AdminEventsContent />
}

function AdminEventsContent() {
  const { toast } = useToast()
  const [events, setEvents] = useState<Event[]>([])
  const [loading, setLoading] = useState(true)
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [editingEvent, setEditingEvent] = useState<Event | null>(null)
  const [saving, setSaving] = useState(false)

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    date: "",
    time_start: "",
    time_end: "",
    location: "",
    category: "",
    max_attendees: 50,
    is_venturo_hosted: false,
    organizer_name: "",
    organizer_email: "",
    external_link: ""
  })

  useEffect(() => {
    fetchEvents()
  }, [])

  const fetchEvents = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/admin/events')
      if (response.ok) {
        const data = await response.json()
        setEvents(data.events || [])
      } else {
        toast({
          title: "Error",
          description: "Failed to fetch events",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Error fetching events:", error)
      toast({
        title: "Error",
        description: "Failed to fetch events",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleAddEvent = async () => {
    if (!formData.title || !formData.date || !formData.location) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      })
      return
    }

    setSaving(true)
    try {
      const response = await fetch('/api/admin/events', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      if (response.ok) {
        toast({
          title: "Success",
          description: "Event created successfully!",
        })
        setIsAddDialogOpen(false)
        resetForm()
        fetchEvents()
      } else {
        const error = await response.json()
        toast({
          title: "Error",
          description: error.error || "Failed to create event",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Error creating event:", error)
      toast({
        title: "Error",
        description: "Failed to create event",
        variant: "destructive",
      })
    } finally {
      setSaving(false)
    }
  }

  const handleEditEvent = async () => {
    if (!editingEvent || !formData.title || !formData.date || !formData.location) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      })
      return
    }

    setSaving(true)
    try {
      const response = await fetch(`/api/admin/events/${editingEvent.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      if (response.ok) {
        toast({
          title: "Success",
          description: "Event updated successfully!",
        })
        setIsEditDialogOpen(false)
        setEditingEvent(null)
        resetForm()
        fetchEvents()
      } else {
        const error = await response.json()
        toast({
          title: "Error",
          description: error.error || "Failed to update event",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Error updating event:", error)
      toast({
        title: "Error",
        description: "Failed to update event",
        variant: "destructive",
      })
    } finally {
      setSaving(false)
    }
  }

  const handleDeleteEvent = async (eventId: string) => {
    if (!confirm("Are you sure you want to delete this event? This action cannot be undone.")) {
      return
    }

    try {
      const response = await fetch(`/api/admin/events/${eventId}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        toast({
          title: "Success",
          description: "Event deleted successfully! 🗑️",
        })
        // Add a small delay to ensure server processing
        setTimeout(() => {
          fetchEvents()
        }, 500)
      } else {
        const error = await response.json()
        console.error("Delete error response:", error)
        toast({
          title: "Error",
          description: error.error || "Failed to delete event",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Error deleting event:", error)
      toast({
        title: "Error",
        description: "Failed to delete event. Please try again.",
        variant: "destructive",
      })
    }
  }

  const resetForm = () => {
    setFormData({
      title: "",
      description: "",
      date: "",
      time_start: "",
      time_end: "",
      location: "",
      category: "",
      max_attendees: 50,
      is_venturo_hosted: false,
      organizer_name: "",
      organizer_email: "",
      external_link: ""
    })
  }

  const openEditDialog = (event: Event) => {
    setEditingEvent(event)
    setFormData({
      title: event.title,
      description: event.description,
      date: event.date,
      time_start: event.time_start,
      time_end: event.time_end,
      location: event.location,
      category: event.category,
      max_attendees: event.max_attendees,
      is_venturo_hosted: event.is_venturo_hosted,
      organizer_name: event.organizer_name,
      organizer_email: event.organizer_email,
      external_link: event.external_link
    })
    setIsEditDialogOpen(true)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-AU', {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  const formatTime = (timeString: string) => {
    return new Date(`2000-01-01T${timeString}`).toLocaleTimeString('en-AU', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    })
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-4">
            <Button variant="ghost" size="sm" asChild>
              <Link href="/">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Site
              </Link>
            </Button>
            <div className="flex items-center gap-3">
              <Rocket className="h-8 w-8 text-blue-500" />
              <div>
                <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  Event Management
                </h1>
                <p className="text-muted-foreground text-lg">🎉 Let's make some awesome events happen!</p>
              </div>
            </div>
          </div>
          
          {/* Stats */}
          <div className="hidden md:flex items-center gap-4">
            <div className="text-center p-3 bg-white rounded-lg shadow-sm border">
              <div className="text-2xl font-bold text-blue-600">{events.length}</div>
              <div className="text-xs text-muted-foreground">Total Events</div>
            </div>
            <div className="text-center p-3 bg-white rounded-lg shadow-sm border">
              <div className="text-2xl font-bold text-green-600">
                {events.filter(e => e.status === 'upcoming').length}
              </div>
              <div className="text-xs text-muted-foreground">Upcoming</div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-2">
            <Crown className="h-5 w-5 text-yellow-500" />
            <span className="text-sm font-medium text-yellow-600">Admin Zone</span>
          </div>
          
          <div className="flex items-center space-x-2">
            <Button variant="outline" asChild>
              <Link href="/admin/subscription">
                <TrendingUp className="h-4 w-4 mr-2" />
                Subscriptions
              </Link>
            </Button>
            <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
              <DialogTrigger asChild>
                <Button className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white shadow-lg">
                  <Plus className="h-4 w-4 mr-2" />
                  Create Event
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle className="flex items-center gap-2">
                    <PartyPopper className="h-5 w-5 text-blue-500" />
                    Create New Event
                  </DialogTitle>
                  <DialogDescription>
                    Let's make something awesome happen! 🎉
                  </DialogDescription>
                </DialogHeader>
                <EventForm 
                  formData={formData}
                  setFormData={setFormData}
                  onSave={handleAddEvent}
                  saving={saving}
                  mode="add"
                />
              </DialogContent>
            </Dialog>
          </div>
        </div>

        {/* Events Grid */}
        {loading ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <Card key={i} className="animate-pulse bg-white/50">
                <CardHeader>
                  <div className="h-6 bg-gray-200 rounded w-3/4 mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded w-full mb-1"></div>
                </CardHeader>
                <CardContent>
                  <div className="h-4 bg-gray-200 rounded w-1/2 mb-3"></div>
                  <div className="h-8 bg-gray-200 rounded w-1/4"></div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : events.length === 0 ? (
          <div className="text-center py-12">
            <div className="max-w-md mx-auto">
              <PartyPopper className="h-16 w-16 text-blue-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">No events yet!</h3>
              <p className="text-muted-foreground mb-6">
                Time to create your first awesome event! 🎉
              </p>
              <Button 
                onClick={() => setIsAddDialogOpen(true)}
                className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600"
              >
                <Plus className="h-4 w-4 mr-2" />
                Create Your First Event
              </Button>
            </div>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {events.map((event) => (
              <Card key={event.id} className="hover:shadow-lg transition-all duration-300 bg-white/70">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-lg mb-2">{event.title}</CardTitle>
                      <div className="flex items-center gap-2 mb-2">
                        <Badge variant="outline">{event.category}</Badge>
                        {event.is_venturo_hosted && (
                          <Badge className="bg-yellow-400 text-black">
                            Venturo Hosted
                          </Badge>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => openEditDialog(event)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDeleteEvent(event.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Calendar className="h-4 w-4 text-blue-500" />
                      <span>{formatDate(event.date)}</span>
                      {event.time_start && (
                        <span>• {formatTime(event.time_start)}</span>
                      )}
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <MapPin className="h-4 w-4 text-red-500" />
                      <span>{event.location}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Users className="h-4 w-4 text-green-500" />
                      <span>{event.current_attendees}/{event.max_attendees} attendees</span>
                    </div>
                    {event.external_link && (
                      <div className="flex items-center gap-2 text-sm">
                        <ExternalLink className="h-4 w-4 text-purple-500" />
                        <a 
                          href={event.external_link} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:underline"
                        >
                          Registration Link
                        </a>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Edit Dialog */}
        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Edit className="h-5 w-5 text-green-500" />
                Edit Event
              </DialogTitle>
              <DialogDescription>
                Make this event even better! ✨
              </DialogDescription>
            </DialogHeader>
            <EventForm 
              formData={formData}
              setFormData={setFormData}
              onSave={handleEditEvent}
              saving={saving}
              mode="edit"
            />
          </DialogContent>
        </Dialog>
      </div>
    </div>
  )
}

interface EventFormProps {
  formData: any
  setFormData: (data: any) => void
  onSave: () => void
  saving: boolean
  mode: 'add' | 'edit'
}

function EventForm({ formData, setFormData, onSave, saving, mode }: EventFormProps) {
  return (
    <div className="space-y-6">
      {/* Title */}
      <div>
        <Label htmlFor="title">Event Title *</Label>
        <Input
          id="title"
          value={formData.title}
          onChange={(e) => setFormData({...formData, title: e.target.value})}
          placeholder="Enter event title"
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
          placeholder="Enter event description"
          rows={3}
          className="mt-1"
        />
      </div>

      {/* Date and Time */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <Label htmlFor="date">Date *</Label>
          <Input
            id="date"
            type="date"
            value={formData.date}
            onChange={(e) => setFormData({...formData, date: e.target.value})}
            className="mt-1"
          />
        </div>
        <div>
          <Label htmlFor="time_start">Start Time</Label>
          <Input
            id="time_start"
            type="time"
            value={formData.time_start}
            onChange={(e) => setFormData({...formData, time_start: e.target.value})}
            className="mt-1"
          />
        </div>
        <div>
          <Label htmlFor="time_end">End Time</Label>
          <Input
            id="time_end"
            type="time"
            value={formData.time_end}
            onChange={(e) => setFormData({...formData, time_end: e.target.value})}
            className="mt-1"
          />
        </div>
      </div>

      {/* Location and Category */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="location">Location *</Label>
          <Input
            id="location"
            value={formData.location}
            onChange={(e) => setFormData({...formData, location: e.target.value})}
            placeholder="Enter event location"
            className="mt-1"
          />
        </div>
        <div>
          <Label htmlFor="category">Category</Label>
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
      </div>

      {/* Organizer Info */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="organizer_name">Organizer Name</Label>
          <Input
            id="organizer_name"
            value={formData.organizer_name}
            onChange={(e) => setFormData({...formData, organizer_name: e.target.value})}
            placeholder="Enter organizer name"
            className="mt-1"
          />
        </div>
        <div>
          <Label htmlFor="organizer_email">Organizer Email</Label>
          <Input
            id="organizer_email"
            type="email"
            value={formData.organizer_email}
            onChange={(e) => setFormData({...formData, organizer_email: e.target.value})}
            placeholder="Enter organizer email"
            className="mt-1"
          />
        </div>
      </div>

      {/* Max Attendees and External Link */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="max_attendees">Max Attendees</Label>
          <Input
            id="max_attendees"
            type="number"
            value={formData.max_attendees}
            onChange={(e) => setFormData({...formData, max_attendees: parseInt(e.target.value) || 0})}
            className="mt-1"
          />
        </div>
        <div>
          <Label htmlFor="external_link">Registration Link</Label>
          <Input
            id="external_link"
            type="url"
            value={formData.external_link}
            onChange={(e) => setFormData({...formData, external_link: e.target.value})}
            placeholder="https://..."
            className="mt-1"
          />
        </div>
      </div>

      {/* Venturo Hosted Toggle */}
      <div className="flex items-center space-x-2">
        <input
          type="checkbox"
          id="is_venturo_hosted"
          checked={formData.is_venturo_hosted}
          onChange={(e) => setFormData({...formData, is_venturo_hosted: e.target.checked})}
          className="rounded"
        />
        <Label htmlFor="is_venturo_hosted">Venturo Hosted Event</Label>
      </div>

      {/* Action Buttons */}
      <div className="flex justify-end gap-3 pt-6">
        <Button 
          onClick={onSave} 
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
              {mode === 'add' ? <Plus className="h-4 w-4 mr-2" /> : <CheckCircle className="h-4 w-4 mr-2" />}
              {mode === 'add' ? 'Create Event' : 'Update Event'}
            </>
          )}
        </Button>
      </div>
    </div>
  )
}
