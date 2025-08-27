import { NextRequest, NextResponse } from "next/server"
import { supabase } from "@/lib/supabaseClient"
import { auth } from "@clerk/nextjs/server"

export async function GET(
  request: NextRequest,
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

    // Get user's profile ID
    const { data: userProfile, error: profileError } = await supabase
      .from('user_profiles')
      .select('id')
      .eq('clerk_user_id', userId)
      .single()

    if (profileError || !userProfile) {
      return NextResponse.json(
        { error: "User profile not found" },
        { status: 404 }
      )
    }

    // Get the idea
    const { data: idea, error } = await supabase
      .from('startup_ideas')
      .select('*')
      .eq('id', ideaId)
      .eq('owner_id', userProfile.id)
      .single()

    if (error || !idea) {
      return NextResponse.json(
        { error: "Idea not found" },
        { status: 404 }
      )
    }

    return NextResponse.json({ data: idea })
  } catch (error) {
    console.error("API error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}

export async function PUT(
  request: NextRequest,
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
    const body = await request.json()

    // Get user's profile ID
    const { data: userProfile, error: profileError } = await supabase
      .from('user_profiles')
      .select('id')
      .eq('clerk_user_id', userId)
      .single()

    if (profileError || !userProfile) {
      return NextResponse.json(
        { error: "User profile not found" },
        { status: 404 }
      )
    }

    // Verify user owns this idea
    const { data: existingIdea, error: checkError } = await supabase
      .from('startup_ideas')
      .select('owner_id')
      .eq('id', ideaId)
      .single()

    if (checkError || !existingIdea) {
      return NextResponse.json(
        { error: "Idea not found" },
        { status: 404 }
      )
    }

    if (existingIdea.owner_id !== userProfile.id) {
      return NextResponse.json(
        { error: "Unauthorized to edit this idea" },
        { status: 403 }
      )
    }

    // Update the idea
    const { data: updatedIdea, error } = await supabase
      .from('startup_ideas')
      .update({
        title: body.title,
        one_liner: body.one_liner,
        description: body.description,
        category: body.category,
        stage: body.stage,
        needs: body.needs,
        links: body.links,
        tags: body.tags,
        updated_at: new Date().toISOString()
      })
      .eq('id', ideaId)
      .select()
      .single()

    if (error) {
      console.error("Supabase error:", error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ 
      success: true, 
      data: updatedIdea,
      message: "Idea updated successfully!"
    })
  } catch (error) {
    console.error("API error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
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

    // Get user's profile ID
    const { data: userProfile, error: profileError } = await supabase
      .from('user_profiles')
      .select('id')
      .eq('clerk_user_id', userId)
      .single()

    if (profileError || !userProfile) {
      return NextResponse.json(
        { error: "User profile not found" },
        { status: 404 }
      )
    }

    // Verify user owns this idea
    const { data: existingIdea, error: checkError } = await supabase
      .from('startup_ideas')
      .select('owner_id')
      .eq('id', ideaId)
      .single()

    if (checkError || !existingIdea) {
      return NextResponse.json(
        { error: "Idea not found" },
        { status: 404 }
      )
    }

    if (existingIdea.owner_id !== userProfile.id) {
      return NextResponse.json(
        { error: "Unauthorized to delete this idea" },
        { status: 403 }
      )
    }

    // Try hard delete first
    let { error } = await supabase
      .from('startup_ideas')
      .delete()
      .eq('id', ideaId)

    console.log(`Deleting idea ${ideaId}, error:`, error)

    // If RLS error, try using RPC function
    if (error && error.code === '42501') {
      console.log('RLS error, trying RPC function...')
      const { data: rpcResult, error: rpcError } = await supabase
        .rpc('delete_user_idea', {
          idea_id: ideaId,
          user_clerk_id: userId
        })

      if (rpcError) {
        console.error("RPC error:", rpcError)
        return NextResponse.json({ error: "Failed to delete idea" }, { status: 500 })
      }

      if (!rpcResult) {
        return NextResponse.json({ error: "Idea not found or unauthorized" }, { status: 404 })
      }
    } else if (error) {
      console.error("Supabase error:", error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ 
      success: true,
      message: "Idea deleted successfully!"
    })
  } catch (error) {
    console.error("API error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
