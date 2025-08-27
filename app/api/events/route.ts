import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/supabaseClient'
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

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const isVenturoHosted = searchParams.get('venturoHosted')
    const category = searchParams.get('category')
    const limit = searchParams.get('limit')
    
    const filters: any = {}
    if (isVenturoHosted) filters.isVenturoHosted = isVenturoHosted === 'true'
    if (category) filters.category = category
    if (limit) filters.limit = parseInt(limit)
    
    const events = await db.getEvents(filters)
    
    return NextResponse.json({ events })
  } catch (error) {
    console.error('Error fetching events:', error)
    return NextResponse.json(
      { error: 'Failed to fetch events' },
      { status: 500 }
    )
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
    await db.supabase.from('ai_moderation_logs').insert({
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
