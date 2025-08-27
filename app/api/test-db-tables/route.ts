import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabaseClient'

export async function GET() {
  try {
    // Check if community_feedback table exists
    const { data: feedbackTable, error: feedbackError } = await supabase()
      .from('community_feedback')
      .select('id')
      .limit(1)

    // Check if idea_likes table exists
    const { data: likesTable, error: likesError } = await supabase()
      .from('idea_likes')
      .select('id')
      .limit(1)

    const missing = []
    
    if (feedbackError && feedbackError.code === '42P01') {
      missing.push('community_feedback')
    }
    
    if (likesError && likesError.code === '42P01') {
      missing.push('idea_likes')
    }

    return NextResponse.json({
      success: missing.length === 0,
      missing: missing.length > 0 ? missing : undefined,
      message: missing.length === 0 
        ? 'All new tables exist' 
        : `Missing tables: ${missing.join(', ')}`
    })
  } catch (error) {
    console.error('Error testing tables:', error)
    return NextResponse.json({
      success: false,
      error: 'Failed to test tables'
    }, { status: 500 })
  }
}
