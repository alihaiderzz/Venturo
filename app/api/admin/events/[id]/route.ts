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

export async function PUT(
  request: NextRequest,
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

    // Check if user is admin
    const adminCheck = await isAdmin(userId)
    if (!adminCheck) {
      return NextResponse.json(
        { error: "Admin access required" },
        { status: 403 }
      )
    }

    const eventId = params.id
    const body = await request.json()

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
      external_link,
      status
    } = body

    // Validate required fields
    if (!title || !date || !location) {
      return NextResponse.json(
        { error: "Missing required fields: title, date, location" },
        { status: 400 }
      )
    }

    // Update event
    const { data: updatedEvent, error } = await supabase
      .from('events')
      .update({
        title,
        description: description || "",
        date,
        time_start: time_start || null,
        time_end: time_end || null,
        location,
        category: category || "Other",
        max_attendees: max_attendees || 50,
        is_venturo_hosted: is_venturo_hosted || false,
        organizer_name: organizer_name || "",
        organizer_email: organizer_email || "",
        external_link: external_link || "",
        status: status || 'upcoming',
        updated_at: new Date().toISOString()
      })
      .eq('id', eventId)
      .select()
      .single()

    if (error) {
      console.error("Supabase error:", error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ 
      success: true, 
      event: updatedEvent,
      message: "Event updated successfully!"
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

    // Check if user is admin
    const adminCheck = await isAdmin(userId)
    if (!adminCheck) {
      return NextResponse.json(
        { error: "Admin access required" },
        { status: 403 }
      )
    }

    const { id: eventId } = await params

    // First try direct delete
    const { error: deleteError } = await supabase
      .from('events')
      .delete()
      .eq('id', eventId)

    if (deleteError) {
      console.error("Direct delete failed:", deleteError)
      
      // If RLS error (42501), try using RPC function as fallback
      if (deleteError.code === '42501') {
        console.log("RLS error detected, trying RPC fallback...")
        
        // Try to call an RPC function for admin delete
        const { error: rpcError } = await supabase
          .rpc('delete_admin_event', { event_id: eventId })
        
        if (rpcError) {
          console.error("RPC delete also failed:", rpcError)
          return NextResponse.json({ 
            error: "Failed to delete event. Please try again." 
          }, { status: 500 })
        }
      } else {
        return NextResponse.json({ error: deleteError.message }, { status: 500 })
      }
    }

    return NextResponse.json({ 
      success: true,
      message: "Event deleted successfully!"
    })
  } catch (error) {
    console.error("API error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
