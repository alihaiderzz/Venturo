import { NextRequest, NextResponse } from "next/server"
import { auth } from "@clerk/nextjs/server"
import { supabase } from "@/lib/supabaseClient"

export async function GET() {
  try {
    // Get top 3 featured feedback (admin-selected)
    const { data: feedback, error } = await supabase
      .from('community_feedback')
      .select('*')
      .eq('is_featured', true)
      .eq('is_approved', true)
      .order('rating', { ascending: false })
      .order('created_at', { ascending: false })
      .limit(3)

    if (error) {
      console.error("Supabase error:", error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ feedback: feedback || [] })
  } catch (error) {
    console.error("API error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}

export async function POST(req: NextRequest) {
  try {
    const { userId } = await auth()
    if (!userId) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      )
    }

    const body = await req.json()
    const { quote, author_name, author_role, rating } = body

    // Validate required fields
    if (!quote || !author_name) {
      return NextResponse.json(
        { error: "Quote and author name are required" },
        { status: 400 }
      )
    }

    // Get user profile
    const { data: userProfile } = await supabase
      .from('user_profiles')
      .select('id')
      .eq('clerk_user_id', userId)
      .single()

    if (!userProfile) {
      return NextResponse.json(
        { error: "User profile not found" },
        { status: 404 }
      )
    }

    // Create feedback - simplified approach
    const feedbackData = {
      user_id: userProfile.id,
      quote,
      author_name,
      author_role,
      rating: rating || 5,
      is_approved: false, // Will be reviewed by admin
      is_featured: false, // Will be set by admin
      moderation_score: null,
      moderation_reason: null,
      moderated_at: null
    }

    console.log('Attempting to insert feedback:', feedbackData)

    const { data: feedback, error } = await supabase
      .from('community_feedback')
      .insert(feedbackData)
      .select()
      .single()

    if (error) {
      console.error("Supabase error:", error)
      
      // Try without user_id as fallback
      const fallbackData = {
        quote,
        author_name,
        author_role,
        rating: rating || 5,
        is_approved: false,
        is_featured: false,
        moderation_score: null,
        moderation_reason: null,
        moderated_at: null
      }

      console.log('Trying fallback insert without user_id:', fallbackData)
      
      const { data: feedbackWithoutUser, error: error2 } = await supabase
        .from('community_feedback')
        .insert(fallbackData)
        .select()
        .single()

      if (error2) {
        console.error("Second Supabase error:", error2)
        return NextResponse.json({ 
          error: "Failed to submit feedback. Please try again.",
          details: error2.message 
        }, { status: 500 })
      }
      
      console.log('Fallback insert successful:', feedbackWithoutUser)
      const feedback = feedbackWithoutUser
    } else {
      console.log('Original insert successful:', feedback)
    }

    // No AI moderation - feedback goes to admin for review
    console.log('Feedback submitted for admin review:', feedback.id)

    return NextResponse.json({ 
      success: true, 
      feedback,
      message: "Feedback submitted successfully! It will be reviewed by our team." 
    })
  } catch (error) {
    console.error("API error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
