import { NextRequest, NextResponse } from "next/server"
import { auth } from "@clerk/nextjs/server"

export async function POST(req: NextRequest) {
  try {
    console.log("=== TEST PROFILE API START ===")
    
    // Step 1: Test Clerk auth
    console.log("Testing Clerk auth...")
    const { userId } = await auth()
    console.log("Clerk userId:", userId)
    
    if (!userId) {
      console.log("No userId found")
      return NextResponse.json({ error: "No user ID", step: "auth" }, { status: 401 })
    }

    // Step 2: Test request body parsing
    console.log("Testing request body parsing...")
    const body = await req.json()
    console.log("Request body:", body)
    
    // Step 3: Test environment variables
    console.log("Testing environment variables...")
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    console.log("Supabase URL exists:", !!supabaseUrl)
    console.log("Supabase Key exists:", !!supabaseKey)

    // Step 4: Test Supabase connection
    console.log("Testing Supabase connection...")
    const { createClient } = await import('@supabase/supabase-js')
    const supabase = createClient(supabaseUrl!, supabaseKey!)
    
    const { data, error } = await supabase
      .from('user_profiles')
      .select('count')
      .limit(1)
    
    console.log("Supabase test result:", { data, error })

    console.log("=== TEST PROFILE API SUCCESS ===")
    return NextResponse.json({ 
      success: true, 
      message: "All tests passed!",
      userId,
      body,
      supabaseTest: { data, error }
    })
    
  } catch (error) {
    console.error("=== TEST PROFILE API ERROR ===", error)
    return NextResponse.json({ 
      error: "Test failed", 
      details: error, 
      step: 'exception' 
    }, { status: 500 })
  }
}
