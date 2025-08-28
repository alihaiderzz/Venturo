import { NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/supabaseClient"
import { auth } from "@clerk/nextjs/server"

export async function GET() {
  try {
    const { userId } = await auth()
    if (!userId) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      )
    }

    const userProfile = await db.getUserProfile(userId)
    if (userProfile) {
      return NextResponse.json(userProfile)
    } else {
      return NextResponse.json(null, { status: 404 })
    }
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
    console.log("Received profile data:", body)
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

    // Check if user profile exists
    let userProfile = await db.getUserProfile(userId)
    console.log("Existing profile:", userProfile)
    
    if (userProfile) {
      // Update existing profile
      console.log("Updating existing profile...")
      userProfile = await db.updateUserProfile(userId, {
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
        profile_completed: true
      })
      console.log("Update result:", userProfile)
    } else {
      // Create new profile
      console.log("Creating new profile...")
      userProfile = await db.createUserProfile({
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
        profile_completed: true
      })
      console.log("Create result:", userProfile)
    }

    if (!userProfile) {
      console.error("Failed to save user profile - userProfile is null")
      return NextResponse.json(
        { error: "Failed to save user profile. Please check your database connection." },
        { status: 500 }
      )
    }

    return NextResponse.json({ 
      success: true, 
      userProfile,
      message: "Profile saved successfully!"
    })
  } catch (error) {
    console.error("API error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
