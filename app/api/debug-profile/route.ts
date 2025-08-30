import { NextRequest, NextResponse } from "next/server"
import { supabase } from "@/lib/supabaseClient"
import { auth } from "@clerk/nextjs/server"

export async function POST(req: NextRequest) {
  try {
    console.log("=== DEBUG PROFILE API START ===")
    
    // Step 1: Check authentication
    const { userId } = await auth()
    console.log("Step 1 - User ID:", userId)
    
    if (!userId) {
      console.log("Step 1 - FAILED: No user ID")
      return NextResponse.json(
        { error: "Unauthorized", step: 1 },
        { status: 401 }
      )
    }
    console.log("Step 1 - SUCCESS: User authenticated")

    // Step 2: Parse request body
    const body = await req.json()
    console.log("Step 2 - Request body:", JSON.stringify(body, null, 2))

    // Step 3: Test direct Supabase connection
    console.log("Step 3 - Testing Supabase connection...")
    const { data: testData, error: testError } = await supabase()
      .from('user_profiles')
      .select('*')
      .eq('clerk_user_id', userId)
      .single()
    
    console.log("Step 3 - Direct query result:", { testData, testError })

    // Step 4: Try to create/update profile
    console.log("Step 4 - Attempting to save profile...")
    
    const profileData = {
      clerk_user_id: userId,
      email: body.email || "test@example.com",
      full_name: body.full_name || "Test User",
      role: body.role || "founder",
      bio: body.bio || "",
      location: body.location || "",
      website: body.website || "",
      company: body.company || "",
      state: body.state || "",
      sectors: body.sectors || [],
      skills: body.skills || [],
      time_commitment: body.time_commitment || "part-time",
      indicative_ticket: body.indicative_ticket || "$5k-$25k",
      social_links: body.social_links || {},
      profile_completed: true
    }

    console.log("Step 4 - Profile data to save:", JSON.stringify(profileData, null, 2))

    let result
    if (testData) {
      // Update existing profile
      console.log("Step 4 - Updating existing profile...")
      const { data, error } = await supabase()
        .from('user_profiles')
        .update(profileData)
        .eq('clerk_user_id', userId)
        .select()
        .single()
      
      result = { data, error, action: 'update' }
    } else {
      // Create new profile
      console.log("Step 4 - Creating new profile...")
      const { data, error } = await supabase()
        .from('user_profiles')
        .insert(profileData)
        .select()
        .single()
      
      result = { data, error, action: 'create' }
    }

    console.log("Step 4 - Save result:", JSON.stringify(result, null, 2))

    if (result.error) {
      console.log("Step 4 - FAILED:", result.error)
      return NextResponse.json(
        { 
          error: "Failed to save profile", 
          details: result.error,
          step: 4,
          action: result.action
        },
        { status: 500 }
      )
    }

    console.log("Step 4 - SUCCESS: Profile saved")
    console.log("=== DEBUG PROFILE API END ===")

    return NextResponse.json({ 
      success: true, 
      message: "Profile saved successfully!",
      profile: result.data,
      action: result.action
    })

  } catch (error) {
    console.error("=== DEBUG PROFILE API ERROR ===", error)
    return NextResponse.json(
      { 
        error: "Internal server error", 
        details: error,
        step: 'exception'
      },
      { status: 500 }
    )
  }
}
