import { NextRequest, NextResponse } from "next/server"
import { db, supabase } from "@/lib/supabaseClient"
import { auth } from "@clerk/nextjs/server"

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
    console.log("Test API - Received profile data:", body)
    
    // Test direct Supabase connection
    const { data: testData, error: testError } = await supabase()
      .from('user_profiles')
      .select('*')
      .eq('clerk_user_id', userId)
      .single()
    
    console.log("Test API - Direct Supabase query result:", { testData, testError })

    // Test the db functions
    const existingProfile = await db.getUserProfile(userId)
    console.log("Test API - Existing profile via db function:", existingProfile)

    if (existingProfile) {
      // Test update
      const updateResult = await db.updateUserProfile(userId, {
        full_name: body.full_name || "Test Update",
        profile_completed: true
      })
      console.log("Test API - Update result:", updateResult)
      
      return NextResponse.json({ 
        success: true, 
        message: "Profile updated successfully!",
        existingProfile,
        updateResult
      })
    } else {
      // Test create
      const createResult = await db.createUserProfile({
        clerk_user_id: userId,
        email: body.email || "test@example.com",
        full_name: body.full_name || "Test User",
        profile_completed: true
      })
      console.log("Test API - Create result:", createResult)
      
      return NextResponse.json({ 
        success: true, 
        message: "Profile created successfully!",
        createResult
      })
    }

  } catch (error) {
    console.error("Test API error:", error)
    return NextResponse.json(
      { error: "Internal server error", details: error },
      { status: 500 }
    )
  }
}
