import { supabase } from "@/lib/supabaseClient"
import { NextResponse } from "next/server"

export async function GET() {
  try {
    const { data, error } = await supabase()
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
      .eq('status', 'active')
      .order("created_at", { ascending: false })

    if (error) {
      console.error("Supabase error:", error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ data: data || [] })
  } catch (error) {
    console.error("API error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
