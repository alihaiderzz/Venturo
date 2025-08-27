import { NextRequest, NextResponse } from "next/server"
import { supabase } from "@/lib/supabaseClient"
import { auth } from "@clerk/nextjs/server"

// Simple admin check - you can enhance this later
const ADMIN_EMAILS = [
  "sm.alihaider.nz@gmail.com", // Your email
  "hello@joinventuro.com",
  "team@joinventuro.com",
  "founder@venturo.com",
]

async function isAdmin(userId: string) {
  try {
    const { data: userProfile } = await supabase
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

export async function GET() {
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

    // Get all events (including inactive ones for admin)
    const { data: events, error } = await supabase
      .from("events")
      .select("*")
      .order("created_at", { ascending: false })

    if (error) {
      console.error("Supabase error:", error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ events: events || [] })
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

    // Check if user is admin
    const adminCheck = await isAdmin(userId)
    if (!adminCheck) {
      return NextResponse.json(
        { error: "Admin access required" },
        { status: 403 }
      )
    }

    const body = await req.json()
    const {
      title,
      description,
      date,
      time_start,
      time_end,
      location,
      category,
      max_attendees,
      is_venturo_hosted,
      organizer_name,
      organizer_email,
      external_link
    } = body

    // Validate required fields
    if (!title || !date || !location) {
      return NextResponse.json(
        { error: "Missing required fields: title, date, location" },
        { status: 400 }
      )
    }

    // Create event
    const { data: event, error } = await supabase
      .from('events')
      .insert({
        title,
        description: description || "",
        date,
        time_start: time_start || null,
        time_end: time_end || null,
        location,
        category: category || "Other",
        max_attendees: max_attendees || 50,
        current_attendees: 0,
        is_venturo_hosted: is_venturo_hosted || false,
        status: 'upcoming',
        organizer_name: organizer_name || "",
        organizer_email: organizer_email || "",
        external_link: external_link || "",
        ai_generated_tags: [],
        ai_summary: ""
      })
      .select()
      .single()

    if (error) {
      console.error("Supabase error:", error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ 
      success: true, 
      event,
      message: "Event created successfully!"
    })
  } catch (error) {
    console.error("API error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
