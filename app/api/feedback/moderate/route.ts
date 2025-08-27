import { NextRequest, NextResponse } from "next/server"
import { supabase } from "@/lib/supabaseClient"

// Mock AI moderation function - in production, you'd use OpenAI, Google AI, etc.
async function moderateFeedback(quote: string, author_name: string, author_role?: string): Promise<{
  isApproved: boolean
  score: number
  reason: string
}> {
  // Simple content moderation rules
  const lowerQuote = quote.toLowerCase()
  const lowerName = author_name.toLowerCase()
  
  // Check for inappropriate content
  const inappropriateWords = [
    'spam', 'scam', 'fake', 'terrible', 'awful', 'horrible', 'worst',
    'hate', 'stupid', 'idiot', 'useless', 'waste', 'garbage', 'trash'
  ]
  
  const hasInappropriateContent = inappropriateWords.some(word => 
    lowerQuote.includes(word) || lowerName.includes(word)
  )
  
  // Check for minimum length and quality
  const isTooShort = quote.length < 10
  const isTooLong = quote.length > 500
  
  // Check for repetitive content
  const words = quote.split(' ')
  const uniqueWords = new Set(words)
  const repetitionRatio = uniqueWords.size / words.length
  
  // Calculate quality score (0-100)
  let score = 100
  
  if (hasInappropriateContent) {
    score -= 50
  }
  
  if (isTooShort) {
    score -= 30
  }
  
  if (isTooLong) {
    score -= 20
  }
  
  if (repetitionRatio < 0.6) {
    score -= 25
  }
  
  // Check for positive sentiment indicators
  const positiveWords = [
    'great', 'amazing', 'excellent', 'wonderful', 'fantastic', 'awesome',
    'love', 'helpful', 'useful', 'good', 'nice', 'perfect', 'best',
    'recommend', 'satisfied', 'happy', 'pleased', 'impressed'
  ]
  
  const hasPositiveContent = positiveWords.some(word => lowerQuote.includes(word))
  if (hasPositiveContent) {
    score += 20
  }
  
  // Ensure score is within bounds
  score = Math.max(0, Math.min(100, score))
  
  const isApproved = score >= 70 && !hasInappropriateContent && !isTooShort
  
  let reason = ''
  if (hasInappropriateContent) {
    reason = 'Contains inappropriate content'
  } else if (isTooShort) {
    reason = 'Feedback is too short'
  } else if (isTooLong) {
    reason = 'Feedback is too long'
  } else if (repetitionRatio < 0.6) {
    reason = 'Content appears repetitive'
  } else if (score < 70) {
    reason = 'Low quality content'
  } else {
    reason = 'Approved by AI moderation'
  }
  
  return {
    isApproved,
    score,
    reason
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { feedbackId } = body

    if (!feedbackId) {
      return NextResponse.json(
        { error: "Feedback ID is required" },
        { status: 400 }
      )
    }

    // Get the feedback to moderate
    const { data: feedback, error: fetchError } = await supabase
      .from('community_feedback')
      .select('*')
      .eq('id', feedbackId)
      .single()

    if (fetchError || !feedback) {
      return NextResponse.json(
        { error: "Feedback not found" },
        { status: 404 }
      )
    }

    // Run AI moderation
    const moderation = await moderateFeedback(
      feedback.quote,
      feedback.author_name,
      feedback.author_role
    )

    // Update feedback with moderation results
    const { data: updatedFeedback, error: updateError } = await supabase
      .from('community_feedback')
      .update({
        is_approved: moderation.isApproved,
        updated_at: new Date().toISOString()
      })
      .eq('id', feedbackId)
      .select()
      .single()

    if (updateError) {
      console.error("Supabase error:", updateError)
      return NextResponse.json({ error: updateError.message }, { status: 500 })
    }

    return NextResponse.json({
      success: true,
      feedback: updatedFeedback,
      moderation: {
        isApproved: moderation.isApproved,
        score: moderation.score,
        reason: moderation.reason
      }
    })
  } catch (error) {
    console.error("API error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
