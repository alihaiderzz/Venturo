import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/supabaseClient'
import { auth } from '@clerk/nextjs/server'

// AI Content Moderation for Startup Ideas
async function moderateIdeaContent(content: string) {
  try {
    // This would integrate with OpenAI or similar AI service
    const flaggedWords = ['scam', 'fake', 'inappropriate', 'spam']
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
      approved: true,
      confidence: 0.5,
      flaggedReasons: [],
      suggestions: null
    }
  }
}

// AI Enhancement for Startup Ideas
async function enhanceIdeaWithAI(ideaData: any) {
  try {
    const enhancedData = {
      ...ideaData,
      ai_generated_tags: generateIdeaTags(ideaData.title, ideaData.description, ideaData.category),
      ai_summary: generateIdeaSummary(ideaData.description)
    }
    
    return enhancedData
  } catch (error) {
    console.error('AI enhancement error:', error)
    return ideaData
  }
}

function generateIdeaTags(title: string, description: string, category: string): string[] {
  const tags = [category]
  
  const keywords = {
    'Technology': ['tech', 'software', 'innovation', 'digital'],
    'Sustainability': ['green', 'eco', 'environmental', 'renewable'],
    'Healthcare': ['health', 'medical', 'wellness', 'biotech'],
    'Finance': ['fintech', 'financial', 'payments', 'banking'],
    'Education': ['edtech', 'learning', 'education', 'training'],
    'Retail': ['ecommerce', 'retail', 'consumer', 'shopping']
  }
  
  if (keywords[category as keyof typeof keywords]) {
    tags.push(...keywords[category as keyof typeof keywords])
  }
  
  // Extract additional tags from title and description
  const commonWords = ['app', 'platform', 'service', 'solution', 'marketplace', 'ai', 'ml', 'blockchain']
  commonWords.forEach(word => {
    if (title.toLowerCase().includes(word) || description.toLowerCase().includes(word)) {
      tags.push(word)
    }
  })
  
  return [...new Set(tags)] // Remove duplicates
}

function generateIdeaSummary(description: string): string {
  if (!description) return ''
  
  return description.length > 150 
    ? description.substring(0, 150) + '...'
    : description
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const category = searchParams.get('category')
    const ownerId = searchParams.get('ownerId')
    const status = searchParams.get('status')
    const limit = searchParams.get('limit')
    
    const filters: any = {}
    if (category) filters.category = category
    if (ownerId) filters.ownerId = ownerId
    if (status) filters.status = status
    if (limit) filters.limit = parseInt(limit)
    
    const ideas = await db.getStartupIdeas(filters)
    
    return NextResponse.json({ ideas })
  } catch (error) {
    console.error('Error fetching startup ideas:', error)
    return NextResponse.json(
      { error: 'Failed to fetch startup ideas' },
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
    const { title, one_liner, description, category, stage, needs } = body
    
    // Validate required fields
    if (!title || !one_liner || !category) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }
    
    // AI Content Moderation
    const contentToModerate = `${title} ${one_liner} ${description || ''}`
    const moderationResult = await moderateIdeaContent(contentToModerate)
    
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
    
    // Prepare idea data
    const ideaData = {
      title,
      one_liner,
      description,
      category,
      stage,
      owner_id: userProfile.id,
      needs: needs || {},
      status: 'active'
    }
    
    // AI Enhancement
    const enhancedIdeaData = await enhanceIdeaWithAI(ideaData)
    
    // Create idea
    const idea = await db.createStartupIdea(enhancedIdeaData)
    
    if (!idea) {
      return NextResponse.json(
        { error: 'Failed to create startup idea' },
        { status: 500 }
      )
    }
    
    // Log moderation result
    await db.supabase.from('ai_moderation_logs').insert({
      content_type: 'idea',
      content_id: idea.id,
      moderation_result: moderationResult.approved ? 'approved' : 'rejected',
      ai_confidence: moderationResult.confidence,
      flagged_reasons: moderationResult.flaggedReasons,
      ai_suggestions: moderationResult.suggestions
    })
    
    return NextResponse.json({ 
      idea,
      moderation: {
        approved: moderationResult.approved,
        confidence: moderationResult.confidence
      }
    })
    
  } catch (error) {
    console.error('Error creating startup idea:', error)
    return NextResponse.json(
      { error: 'Failed to create startup idea' },
      { status: 500 }
    )
  }
}
