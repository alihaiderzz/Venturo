import { NextRequest, NextResponse } from "next/server"
import { supabase } from "@/lib/supabaseClient"
import { auth } from "@clerk/nextjs/server"

export async function POST(req: NextRequest) {
  try {
    console.log("=== DEBUG PROFILE API START ===")
    
    // Step 1: Get user ID from Clerk
    const { userId } = await auth()
    console.log("Clerk userId:", userId)
    
    if (!userId) {
      console.log("No userId found - unauthorized")
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Step 2: Parse request body
    const body = await req.json()
    console.log("Request body:", body)
    
    const { 
      email,
      full_name, 
      role, 
      bio, 
      location, 
      website,
      company,
      state, 
      sectors, 
      skills, 
      time_commitment, 
      indicative_ticket, 
      social_links 
    } = body

    // Step 3: Check if profile exists
    console.log("Checking if profile exists...")
    const { data: existingProfile, error: fetchError } = await supabase()
      .from('user_profiles')
      .select('*')
      .eq('clerk_user_id', userId)
      .single()
    
    console.log("Fetch result:", { existingProfile, fetchError })

    if (fetchError && fetchError.code !== 'PGRST116') {
      console.log("Error fetching profile:", fetchError)
      return NextResponse.json({ error: "Failed to fetch profile", details: fetchError }, { status: 500 })
    }

    let result: any
    let action: string

    if (existingProfile) {
      // Step 4a: Update existing profile
      console.log("Updating existing profile...")
      const { data, error } = await supabase()
        .from('user_profiles')
        .update({
          email,
          full_name,
          role,
          bio,
          location,
          website,
          company,
          state,
          sectors,
          skills,
          time_commitment,
          indicative_ticket,
          social_links,
          profile_completed: true,
          updated_at: new Date().toISOString()
        })
        .eq('clerk_user_id', userId)
        .select()
        .single()
      
      console.log("Update result:", { data, error })
      
      if (error) {
        console.log("Update error:", error)
        return NextResponse.json({ error: "Failed to update profile", details: error }, { status: 500 })
      }
      
      result = data
      action = 'updated'
    } else {
      // Step 4b: Create new profile
      console.log("Creating new profile...")
      const { data, error } = await supabase()
        .from('user_profiles')
        .insert({
          clerk_user_id: userId,
          email: email || "",
          full_name,
          role,
          bio,
          location,
          website,
          company,
          state,
          sectors,
          skills,
          time_commitment,
          indicative_ticket,
          social_links,
          profile_completed: true,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        })
        .select()
        .single()
      
      console.log("Create result:", { data, error })
      
      if (error) {
        console.log("Create error:", error)
        return NextResponse.json({ error: "Failed to create profile", details: error }, { status: 500 })
      }
      
      result = data
      action = 'created'
    }

    console.log("=== DEBUG PROFILE API SUCCESS ===")
    return NextResponse.json({ 
      success: true, 
      message: "Profile saved successfully!", 
      profile: result, 
      action 
    })
    
  } catch (error) {
    console.error("=== DEBUG PROFILE API ERROR ===", error)
    return NextResponse.json({ 
      error: "Internal server error", 
      details: error, 
      step: 'exception' 
    }, { status: 500 })
  }
}
