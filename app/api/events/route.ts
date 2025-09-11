import { NextRequest, NextResponse } from 'next/server'
import { db, supabase } from '@/lib/supabaseClient'
import { auth } from '@clerk/nextjs/server'

// AI Content Moderation and Enhancement
async function moderateEventContent(content: string) {
  try {
    // This would integrate with OpenAI or similar AI service
    // For now, we'll implement basic content checking
    const flaggedWords = ['spam', 'inappropriate', 'scam']
    const hasFlaggedContent = flaggedWords.some(word => 
      content.toLowerCase().includes(word)
    )
    
    return {
      approved: !hasFlaggedContent,
      confidence: hasFlaggedContent ? 0.8 : 0.95,
      flaggedReasons: hasFlaggedContent ? ['Potential inappropriate content'] : [],
      suggestions: hasFlaggedContent ? 'Please review your content for appropriateness' : null
    }
  } catch (error) {
    console.error('AI moderation error:', error)
    return {
      approved: true, // Default to approved if AI fails
      confidence: 0.5,
      flaggedReasons: [],
      suggestions: null
    }
  }
}

async function enhanceEventWithAI(eventData: any) {
  try {
    // AI-powered content enhancement
    const enhancedData = {
      ...eventData,
      ai_generated_tags: generateTags(eventData.title, eventData.description, eventData.category),
      ai_summary: generateSummary(eventData.description)
    }
    
    return enhancedData
  } catch (error) {
    console.error('AI enhancement error:', error)
    return eventData
  }
}

function generateTags(title: string, description: string, category: string): string[] {
  // Simple tag generation logic - replace with actual AI
  const tags = [category]
  
  const keywords = {
    'Network Event': ['networking', 'community', 'startup'],
    'Workshop': ['learning', 'skills', 'education'],
    'Pitch Event': ['pitching', 'funding', 'investors'],
    'Conference': ['industry', 'speakers', 'knowledge']
  }
  
  if (keywords[category as keyof typeof keywords]) {
    tags.push(...keywords[category as keyof typeof keywords])
  }
  
  return tags
}

function generateSummary(description: string): string {
  // Simple summary generation - replace with actual AI
  return description.length > 100 
    ? description.substring(0, 100) + '...'
    : description
}

// Mock events data for development
const mockEvents = [
  {
    id: "1",
    title: "Sydney Startup Networking Night",
    description: "Join us for an evening of networking with fellow entrepreneurs, investors, and startup enthusiasts in Sydney.",
    date: "2025-09-20",
    time_start: "18:00",
    time_end: "21:00",
    location: "Sydney Startup Hub, 123 George Street, Sydney NSW 2000",
    category: "Networking",
    max_attendees: 100,
    current_attendees: 45,
    is_venturo_hosted: true,
    status: "upcoming",
    organizer_name: "Venturo Team",
    organizer_email: "team@joinventuro.com",
    external_link: "https://example.com/rsvp",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: "2",
    title: "Melbourne Tech Workshop: AI for Startups",
    description: "Learn how to integrate AI into your startup with hands-on workshops and expert guidance.",
    date: "2025-09-25",
    time_start: "10:00",
    time_end: "16:00",
    location: "Melbourne Innovation Centre, 456 Collins Street, Melbourne VIC 3000",
    category: "Workshop",
    max_attendees: 50,
    current_attendees: 23,
    is_venturo_hosted: false,
    status: "upcoming",
    organizer_name: "Tech Melbourne",
    organizer_email: "info@techmelbourne.com",
    external_link: "https://example.com/workshop",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: "3",
    title: "Brisbane Pitch Competition",
    description: "Showcase your startup idea to a panel of investors and win funding for your venture.",
    date: "2025-10-05",
    time_start: "14:00",
    time_end: "18:00",
    location: "Brisbane Convention Centre, 123 Queen Street, Brisbane QLD 4000",
    category: "Pitch Competition",
    max_attendees: 200,
    current_attendees: 89,
    is_venturo_hosted: true,
    status: "upcoming",
    organizer_name: "Venturo Team",
    organizer_email: "team@joinventuro.com",
    external_link: "https://example.com/pitch",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  }
]

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const isVenturoHosted = searchParams.get('venturoHosted')
    const category = searchParams.get('category')
    const limit = searchParams.get('limit')
    
    // Try to get events from database first
    try {
      const filters: any = {}
      if (isVenturoHosted) filters.isVenturoHosted = isVenturoHosted === 'true'
      if (category) filters.category = category
      if (limit) filters.limit = parseInt(limit)
      
      const events = await db.getEvents(filters)
      
      // If database returns empty array, use mock data
      if (!events || events.length === 0) {
        let filteredEvents = mockEvents
        
        if (isVenturoHosted) {
          filteredEvents = filteredEvents.filter(event => 
            event.is_venturo_hosted === (isVenturoHosted === 'true')
          )
        }
        
        if (category) {
          filteredEvents = filteredEvents.filter(event => event.category === category)
        }
        
        if (limit) {
          filteredEvents = filteredEvents.slice(0, parseInt(limit))
        }
        
        return NextResponse.json({ events: filteredEvents })
      }
      
      return NextResponse.json({ events })
    } catch (error) {
      console.error('Database error, using mock data:', error)
      // Return mock data if database fails
      let filteredEvents = mockEvents
      
      if (isVenturoHosted) {
        filteredEvents = filteredEvents.filter(event => 
          event.is_venturo_hosted === (isVenturoHosted === 'true')
        )
      }
      
      if (category) {
        filteredEvents = filteredEvents.filter(event => event.category === category)
      }
      
      if (limit) {
        filteredEvents = filteredEvents.slice(0, parseInt(limit))
      }
      
      return NextResponse.json({ events: filteredEvents })
    }
  } catch (error) {
    console.error('Error fetching events:', error)
    return NextResponse.json({ events: mockEvents })
  }
}

export async function POST(request: NextRequest) {
  try {
    const { userId } = await auth()
    if (!userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }
    
    const body = await request.json()
    const { title, description, date, time_start, time_end, location, category, max_attendees, external_link } = body
    
    // Validate required fields
    if (!title || !description || !date || !time_start || !time_end || !location || !category) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }
    
    // AI Content Moderation
    const moderationResult = await moderateEventContent(description)
    
    if (!moderationResult.approved) {
      return NextResponse.json(
        { 
          error: 'Content not approved',
          reasons: moderationResult.flaggedReasons,
          suggestions: moderationResult.suggestions
        },
        { status: 400 }
      )
    }
    
    // Get user profile
    const userProfile = await db.getUserProfile(userId)
    if (!userProfile) {
      return NextResponse.json(
        { error: 'User profile not found' },
        { status: 404 }
      )
    }
    
    // Prepare event data
    const eventData = {
      title,
      description,
      date,
      time_start,
      time_end,
      location,
      category,
      max_attendees: max_attendees ? parseInt(max_attendees) : null,
      organizer_id: userProfile.id,
      organizer_name: userProfile.full_name,
      organizer_email: userProfile.email,
      external_link,
      is_venturo_hosted: false, // Community events by default
      status: 'upcoming'
    }
    
    // AI Enhancement
    const enhancedEventData = await enhanceEventWithAI(eventData)
    
    // Create event
    const event = await db.createEvent(enhancedEventData)
    
    if (!event) {
      return NextResponse.json(
        { error: 'Failed to create event' },
        { status: 500 }
      )
    }
    
    // Log moderation result
    await supabase().from('ai_moderation_logs').insert({
      content_type: 'event',
      content_id: event.id,
      moderation_result: moderationResult.approved ? 'approved' : 'rejected',
      ai_confidence: moderationResult.confidence,
      flagged_reasons: moderationResult.flaggedReasons,
      ai_suggestions: moderationResult.suggestions
    })
    
    return NextResponse.json({ 
      event,
      moderation: {
        approved: moderationResult.approved,
        confidence: moderationResult.confidence
      }
    })
    
  } catch (error) {
    console.error('Error creating event:', error)
    return NextResponse.json(
      { error: 'Failed to create event' },
      { status: 500 }
    )
  }
}
