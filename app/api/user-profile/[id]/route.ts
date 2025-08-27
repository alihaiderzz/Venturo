import { NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/supabaseClient"

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const userId = params.id

    if (!userId) {
      return NextResponse.json(
        { error: "User ID is required" },
        { status: 400 }
      )
    }

    // Get user profile by ID
    const { data: userProfile, error } = await db.supabase
      .from('user_profiles')
      .select('*')
      .eq('id', userId)
      .single()

    if (error || !userProfile) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      )
    }

    return NextResponse.json(userProfile)
  } catch (error) {
    console.error("API error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
