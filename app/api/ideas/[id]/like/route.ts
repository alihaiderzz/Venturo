import { NextRequest, NextResponse } from "next/server"
import { auth } from "@clerk/nextjs/server"
import { supabase } from "@/lib/supabaseClient"

export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { userId } = await auth()
    if (!userId) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      )
    }

    const ideaId = params.id

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

    // Check if already liked
    const { data: existingLike } = await supabase
      .from('idea_likes')
      .select('id')
      .eq('idea_id', ideaId)
      .eq('user_id', userProfile.id)
      .single()

    if (existingLike) {
      // Unlike
      const { error: deleteError } = await supabase
        .from('idea_likes')
        .delete()
        .eq('idea_id', ideaId)
        .eq('user_id', userProfile.id)

      if (deleteError) {
        console.error("Error unliking idea:", deleteError)
        return NextResponse.json(
          { error: "Failed to unlike idea" },
          { status: 500 }
        )
      }

      // Update idea stats
      await supabase.rpc('increment_idea_views', { 
        idea_id: ideaId, 
        increment_amount: -1 
      })

      return NextResponse.json({ liked: false })
    } else {
      // Like
      const { error: insertError } = await supabase
        .from('idea_likes')
        .insert({
          idea_id: ideaId,
          user_id: userProfile.id
        })

      if (insertError) {
        console.error("Error liking idea:", insertError)
        return NextResponse.json(
          { error: "Failed to like idea" },
          { status: 500 }
        )
      }

      // Update idea stats
      await supabase.rpc('increment_idea_views', { 
        idea_id: ideaId, 
        increment_amount: 1 
      })

      return NextResponse.json({ liked: true })
    }
  } catch (error) {
    console.error("API error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { userId } = await auth()
    if (!userId) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      )
    }

    const { id: ideaId } = await params

    // Get user profile
    const { data: userProfile } = await supabase
      .from('user_profiles')
      .select('id')
      .eq('clerk_user_id', userId)
      .single()

    if (!userProfile) {
      return NextResponse.json({ liked: false })
    }

    // Check if liked
    const { data: like } = await supabase
      .from('idea_likes')
      .select('id')
      .eq('idea_id', ideaId)
      .eq('user_id', userProfile.id)
      .single()

    return NextResponse.json({ liked: !!like })
  } catch (error) {
    console.error("API error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
