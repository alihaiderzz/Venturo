"use client"
import { useEffect, useState } from "react"
import { LegalNotice } from "@/components/LegalNotice"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Calendar, MapPin, Users, Clock, ExternalLink, Star, Plus, Loader2, Mail, FileText, CheckCircle } from "lucide-react"
import Link from "next/link"
import { Event } from "@/lib/supabaseClient"

export default function EventsPage() {
  const [events, setEvents] = useState<Event[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchEvents()
  }, [])

  const fetchEvents = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/events')
      const data = await response.json()
      
      if (response.ok) {
        setEvents(data.events)
      } else {
        setError(data.error || 'Failed to fetch events')
      }
    } catch (err) {
      setError('Failed to fetch events')
      console.error('Error fetching events:', err)
    } finally {
      setLoading(false)
    }
  }

  // Sort events to show Venturo-hosted events first
  const sortedEvents = [...events].sort((a, b) => {
    if (a.is_venturo_hosted && !b.is_venturo_hosted) return -1;
    if (!a.is_venturo_hosted && b.is_venturo_hosted) return 1;
    return new Date(a.date).getTime() - new Date(b.date).getTime();
  });

  const venturoEvents = events.filter(event => event.is_venturo_hosted);
  const communityEvents = events.filter(event => !event.is_venturo_hosted);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-AU', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  const formatTime = (timeString: string) => {
    return new Date(`2000-01-01T${timeString}`).toLocaleTimeString('en-AU', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    })
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-[#21C087]" />
          <p className="text-muted-foreground">Loading events...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-500 mb-4">{error}</p>
          <Button onClick={fetchEvents} className="bg-[#21C087] hover:bg-[#1a9f6f]">
            Try Again
          </Button>
        </div>
      </div>
    )
  }

  return (
    <main className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <LegalNotice />
      </div>
      
      {/* Header */}
      <div className="flex items-center space-x-4 mb-8">
        <Button variant="ghost" size="sm" asChild>
          <Link href="/" aria-label="Back to home">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Link>
        </Button>
        <div>
          <h1 className="text-3xl font-bold text-[#0B1E3C]">Events</h1>
          <p className="text-muted-foreground mt-1">Connect with the Australian startup community</p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <Card className="bg-gradient-to-r from-[#21C087] to-[#1a9f6f] text-white">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm opacity-90">Upcoming Events</p>
                <p className="text-2xl font-bold">{events.length}</p>
              </div>
              <Calendar className="h-8 w-8 opacity-80" />
            </div>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-r from-[#F5B800] to-[#e6a800] text-white">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm opacity-90">Total Attendees</p>
                <p className="text-2xl font-bold">
                  {events.reduce((total, event) => total + event.current_attendees, 0)}
                </p>
              </div>
              <Users className="h-8 w-8 opacity-80" />
            </div>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-r from-[#0B1E3C] to-[#1a2d4f] text-white">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm opacity-90">Venturo Events</p>
                <p className="text-2xl font-bold">{venturoEvents.length}</p>
              </div>
              <Star className="h-8 w-8 opacity-80" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Event Submission Guide */}
      <div className="mb-8">
        <Card className="bg-gradient-to-r from-[#F6F7F9] to-[#eef0f3] border-0">
          <CardContent className="p-6">
            <div className="flex items-center space-x-3 mb-4">
              <Mail className="h-6 w-6 text-[#21C087]" />
              <h3 className="text-xl font-bold text-[#0B1E3C]">Submit Your Event</h3>
            </div>
            <p className="text-muted-foreground mb-4">
              Want to host an event? Email us at <a href="mailto:team@joinventuro.com" className="text-[#21C087] hover:underline font-medium">team@joinventuro.com</a> with the following details:
            </p>
            
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold text-[#0B1E3C] mb-3 flex items-center">
                  <FileText className="h-4 w-4 mr-2 text-[#21C087]" />
                  Required Information
                </h4>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-start">
                    <CheckCircle className="h-4 w-4 mr-2 mt-0.5 text-[#21C087] flex-shrink-0" />
                    <span><strong>Event Title:</strong> Clear, descriptive name</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="h-4 w-4 mr-2 mt-0.5 text-[#21C087] flex-shrink-0" />
                    <span><strong>Date & Time:</strong> DD/MM/YYYY format, start and end times</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="h-4 w-4 mr-2 mt-0.5 text-[#21C087] flex-shrink-0" />
                    <span><strong>Location:</strong> Venue name and address</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="h-4 w-4 mr-2 mt-0.5 text-[#21C087] flex-shrink-0" />
                    <span><strong>Description:</strong> What attendees can expect</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="h-4 w-4 mr-2 mt-0.5 text-[#21C087] flex-shrink-0" />
                    <span><strong>Category:</strong> Networking, Workshop, Pitch, etc.</span>
                  </li>
                </ul>
              </div>
              
              <div>
                <h4 className="font-semibold text-[#0B1E3C] mb-3 flex items-center">
                  <FileText className="h-4 w-4 mr-2 text-[#21C087]" />
                  Additional Details
                </h4>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-start">
                    <CheckCircle className="h-4 w-4 mr-2 mt-0.5 text-[#21C087] flex-shrink-0" />
                    <span><strong>Organizer:</strong> Your name and contact email</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="h-4 w-4 mr-2 mt-0.5 text-[#21C087] flex-shrink-0" />
                    <span><strong>Max Attendees:</strong> Capacity limit (if any)</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="h-4 w-4 mr-2 mt-0.5 text-[#21C087] flex-shrink-0" />
                    <span><strong>Registration Link:</strong> External booking URL</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="h-4 w-4 mr-2 mt-0.5 text-[#21C087] flex-shrink-0" />
                    <span><strong>Venturo Hosted:</strong> Let us know if you'd like Venturo branding</span>
                  </li>
                </ul>
              </div>
            </div>
            
            <div className="mt-6 p-4 bg-white rounded-lg border border-[#21C087]/20">
              <h5 className="font-semibold text-[#0B1E3C] mb-2">📧 Email Template</h5>
              <div className="text-sm text-muted-foreground font-mono bg-gray-50 p-3 rounded">
                <div>Subject: Event Submission - [Your Event Title]</div>
                <br />
                <div>Hi Venturo Team,</div>
                <br />
                <div>I'd like to submit an event for the platform:</div>
                <br />
                <div>• Event Title: [Your Event Title]</div>
                <div>• Date: [DD/MM/YYYY]</div>
                <div>• Time: [Start Time] - [End Time]</div>
                <div>• Location: [Venue Name, Address]</div>
                <div>• Category: [Networking/Workshop/Pitch/etc.]</div>
                <div>• Description: [Brief description of what attendees can expect]</div>
                <div>• Organizer: [Your Name] - [Your Email]</div>
                <div>• Registration Link: [URL if applicable]</div>
                <br />
                <div>Thanks!</div>
                <div>[Your Name]</div>
              </div>
            </div>
            
            <div className="mt-4 flex flex-col sm:flex-row gap-3">
              <Button 
                asChild
                className="bg-[#21C087] hover:bg-[#1a9f6f] text-white"
              >
                <a href="mailto:team@joinventuro.com?subject=Event Submission">Submit Event via Email</a>
              </Button>
              <Button 
                variant="outline"
                className="border-[#0B1E3C] text-[#0B1E3C] hover:bg-[#0B1E3C] hover:text-white"
              >
                <a href="/contact">Contact Us First</a>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Venturo Hosted Events Section */}
      {venturoEvents.length > 0 && (
        <div className="mb-12">
          <div className="flex items-center space-x-3 mb-6">
            <Star className="h-6 w-6 text-[#F5B800]" />
            <h2 className="text-2xl font-bold text-[#0B1E3C]">Venturo Network Events</h2>
            <Badge className="bg-[#F5B800] text-[#0B1E3C] font-semibold">Featured</Badge>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {venturoEvents.map((event) => (
              <Card key={event.id} className="hover:shadow-lg transition-all duration-200 border-2 border-[#F5B800] shadow-md relative overflow-hidden">
                <div className="absolute top-0 right-0 bg-[#F5B800] text-[#0B1E3C] px-3 py-1 text-xs font-bold rounded-bl-lg">
                  VENTURO HOSTED
                </div>
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-lg text-[#0B1E3C] line-clamp-2">{event.title}</CardTitle>
                      <CardDescription className="mt-2">
                        <Badge 
                          variant="outline" 
                          className="text-xs border-[#21C087] text-[#21C087] hover:bg-[#21C087] hover:text-white"
                        >
                          {event.category}
                        </Badge>
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-sm text-muted-foreground line-clamp-3">
                    {event.description}
                  </p>
                  
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center text-muted-foreground">
                      <Calendar className="h-4 w-4 mr-2 text-[#21C087]" />
                      <span>{formatDate(event.date)}</span>
                    </div>
                    <div className="flex items-center text-muted-foreground">
                      <Clock className="h-4 w-4 mr-2 text-[#21C087]" />
                      <span>{formatTime(event.time_start)} - {formatTime(event.time_end)}</span>
                    </div>
                    <div className="flex items-center text-muted-foreground">
                      <MapPin className="h-4 w-4 mr-2 text-[#21C087]" />
                      <span className="line-clamp-1">{event.location}</span>
                    </div>
                    <div className="flex items-center text-muted-foreground">
                      <Users className="h-4 w-4 mr-2 text-[#21C087]" />
                      <span>{event.current_attendees} / {event.max_attendees || '∞'}</span>
                    </div>
                  </div>

                  <div className="flex gap-2 pt-2">
                    <Button 
                      asChild 
                      className="flex-1 bg-[#21C087] hover:bg-[#1a9f6f] text-white"
                    >
                      <a href={event.external_link || '#'} aria-label={`RSVP for ${event.title}`}>
                        RSVP Now
                      </a>
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm"
                      className="border-[#F5B800] text-[#F5B800] hover:bg-[#F5B800] hover:text-[#0B1E3C]"
                    >
                      <ExternalLink className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Community Events Section */}
      {communityEvents.length > 0 && (
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-[#0B1E3C] mb-6">Community Events</h2>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {communityEvents.map((event) => (
          <Card key={event.id} className="hover:shadow-lg transition-all duration-200 border-0 shadow-md">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <CardTitle className="text-lg text-[#0B1E3C] line-clamp-2">{event.title}</CardTitle>
                  <CardDescription className="mt-2">
                    <Badge 
                      variant="outline" 
                      className="text-xs border-[#21C087] text-[#21C087] hover:bg-[#21C087] hover:text-white"
                    >
                      {event.category}
                    </Badge>
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground line-clamp-3">
                {event.description}
              </p>
              
              <div className="space-y-2 text-sm">
                <div className="flex items-center text-muted-foreground">
                  <Calendar className="h-4 w-4 mr-2 text-[#21C087]" />
                      <span>{formatDate(event.date)}</span>
                </div>
                <div className="flex items-center text-muted-foreground">
                  <Clock className="h-4 w-4 mr-2 text-[#21C087]" />
                      <span>{formatTime(event.time_start)} - {formatTime(event.time_end)}</span>
                </div>
                <div className="flex items-center text-muted-foreground">
                  <MapPin className="h-4 w-4 mr-2 text-[#21C087]" />
                  <span className="line-clamp-1">{event.location}</span>
                </div>
                <div className="flex items-center text-muted-foreground">
                  <Users className="h-4 w-4 mr-2 text-[#21C087]" />
                      <span>{event.current_attendees} / {event.max_attendees || '∞'}</span>
                </div>
              </div>

              <div className="flex gap-2 pt-2">
                <Button 
                  asChild 
                  className="flex-1 bg-[#21C087] hover:bg-[#1a9f6f] text-white"
                >
                      <a href={event.external_link || '#'} aria-label={`RSVP for ${event.title}`}>
                    RSVP Now
                  </a>
                </Button>
                <Button 
                  variant="outline" 
                  size="sm"
                      className="border-[#F5B800] text-[#F5B800] hover:bg-[#F5B800] hover:text-[#0B1E3C]"
                >
                  <ExternalLink className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
        </div>
      )}

      {/* No Events State */}
      {events.length === 0 && !loading && (
        <div className="text-center py-12">
          <Calendar className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-xl font-semibold mb-2">No Events Yet</h3>
          <p className="text-muted-foreground mb-6">
            Be the first to host an event in your community!
          </p>
          <Button asChild className="bg-[#21C087] hover:bg-[#1a9f6f]">
            <a href="mailto:team@joinventuro.com?subject=Event Submission">Submit Your Event</a>
          </Button>
        </div>
      )}

      {/* Call to Action */}
      <div className="mt-12 text-center">
        <Card className="bg-gradient-to-r from-[#F6F7F9] to-[#eef0f3] border-0">
          <CardContent className="p-8">
            <h2 className="text-2xl font-bold text-[#0B1E3C] mb-4">Host Your Own Event</h2>
            <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
              Want to host a startup event in your city? We'd love to help you connect with the local community.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              asChild
              className="bg-[#21C087] hover:bg-[#1a9f6f] text-white"
            >
              <Link href="/contact">Get in Touch</Link>
            </Button>
              <Button 
                asChild
                variant="outline"
                className="border-[#F5B800] text-[#F5B800] hover:bg-[#F5B800] hover:text-[#0B1E3C]"
              >
                <a href="mailto:team@joinventuro.com?subject=Event Submission">Submit Event</a>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </main>
  )
}

