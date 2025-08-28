import { NextRequest, NextResponse } from "next/server"
import { supabase } from "@/lib/supabaseClient"
import { auth } from "@clerk/nextjs/server"

export async function GET(request: NextRequest) {
  try {
    const { userId } = await auth()
    if (!userId) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      )
    }

    // Get user's profile ID
    const { data: userProfile, error: profileError } = await supabase()
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

    // Get active ideas owned by the current user
    const { data: ideas, error } = await supabase()
      .from("startup_ideas")
      .select(`
        *,
        owner:user_profiles!startup_ideas_owner_id_fkey(
          id,
          full_name,
          role,
          location,
          company
        )
      `)
      .eq('owner_id', userProfile.id)
      .eq('status', 'active')
      .order("created_at", { ascending: false })

    if (error) {
      console.error("Supabase error:", error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    console.log(`Fetched ${ideas?.length || 0} ideas for user ${userProfile.id}`)
    return NextResponse.json({ data: ideas || [] })
  } catch (error) {
    console.error("API error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
