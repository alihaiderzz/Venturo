import { NextRequest, NextResponse } from "next/server"

export async function POST(req: NextRequest) {
  try {
    console.log("=== SIMPLE TEST API START ===")
    
    // Test 1: Basic function
    console.log("Test 1: Basic function works")
    
    // Test 2: Request body
    const body = await req.json()
    console.log("Test 2: Request body:", body)
    
    // Test 3: Environment variables
    const envVars = {
      supabaseUrl: !!process.env.NEXT_PUBLIC_SUPABASE_URL,
      supabaseKey: !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
      clerkKey: !!process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY,
      clerkSecret: !!process.env.CLERK_SECRET_KEY
    }
    console.log("Test 3: Environment variables:", envVars)

    console.log("=== SIMPLE TEST API SUCCESS ===")
    return NextResponse.json({ 
      success: true, 
      message: "Simple test passed!",
      body,
      envVars
    })
    
  } catch (error) {
    console.error("=== SIMPLE TEST API ERROR ===", error)
    return NextResponse.json({ 
      error: "Simple test failed", 
      details: error, 
      step: 'exception' 
    }, { status: 500 })
  }
}
