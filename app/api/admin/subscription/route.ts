import { NextRequest, NextResponse } from "next/server"
import { auth } from "@clerk/nextjs/server"
import { supabase } from "@/lib/supabaseClient"

// Admin emails that can manage subscriptions
const ADMIN_EMAILS = [
  "sm.alihaider.nz@gmail.com",
  "hello@joinventuro.com", 
  "team@joinventuro.com",
  "founder@venturo.com",
]

async function isAdmin(userId: string) {
  try {
    const { data: userProfile } = await supabase()
      .from('user_profiles')
      .select('email')
      .eq('clerk_user_id', userId)
      .single()

    return userProfile?.email && ADMIN_EMAILS.includes(userProfile.email)
  } catch (error) {
    console.error("Error checking admin status:", error)
    return false
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

    // Check if user is admin
    const adminCheck = await isAdmin(userId)
    if (!adminCheck) {
      return NextResponse.json(
        { error: "Admin access required" },
        { status: 403 }
      )
    }

    const body = await req.json()
    const { userEmail, subscriptionTier, expiresAt } = body

    if (!userEmail || !subscriptionTier) {
      return NextResponse.json(
        { error: "User email and subscription tier are required" },
        { status: 400 }
      )
    }

    // Update user's subscription
    const { data: updatedProfile, error } = await supabase()
      .from('user_profiles')
      .update({
        subscription_tier: subscriptionTier,
        subscription_expires_at: expiresAt || null,
        updated_at: new Date().toISOString()
      })
      .eq('email', userEmail)
      .select()
      .single()

    if (error) {
      console.error("Supabase error:", error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ 
      success: true, 
      userProfile: updatedProfile,
      message: `Subscription updated to ${subscriptionTier}`
    })
  } catch (error) {
    console.error("API error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}

export async function GET(req: NextRequest) {
  try {
    const { userId } = await auth()
    if (!userId) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      )
    }

    // Check if user is admin
    const adminCheck = await isAdmin(userId)
    if (!adminCheck) {
      return NextResponse.json(
        { error: "Admin access required" },
        { status: 403 }
      )
    }

    const { searchParams } = new URL(req.url)
    const userEmail = searchParams.get('email')

    if (!userEmail) {
      return NextResponse.json(
        { error: "User email is required" },
        { status: 400 }
      )
    }

    // Get user's subscription info
    const { data: userProfile, error } = await supabase()
      .from('user_profiles')
      .select('email, subscription_tier, subscription_expires_at')
      .eq('email', userEmail)
      .single()

    if (error) {
      console.error("Supabase error:", error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ userProfile })
  } catch (error) {
    console.error("API error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
