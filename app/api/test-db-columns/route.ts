import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabaseClient'

export async function GET() {
  try {
    // Check if new columns exist in user_profiles
    const { data: userProfile, error: userError } = await supabase()
      .from('user_profiles')
      .select('subscription_tier, subscription_expires_at')
      .limit(1)

    // Check if new columns exist in startup_ideas
    const { data: startupIdea, error: ideaError } = await supabase()
      .from('startup_ideas')
      .select('images, company_logo, company_logo_public_id')
      .limit(1)

    const missing = []
    
    if (userError && userError.message.includes('column') && userError.message.includes('does not exist')) {
      missing.push('user_profiles.subscription_tier', 'user_profiles.subscription_expires_at')
    }
    
    if (ideaError && ideaError.message.includes('column') && ideaError.message.includes('does not exist')) {
      missing.push('startup_ideas.images', 'startup_ideas.company_logo', 'startup_ideas.company_logo_public_id')
    }

    return NextResponse.json({
      success: missing.length === 0,
      missing: missing.length > 0 ? missing : undefined,
      message: missing.length === 0 
        ? 'All new columns exist' 
        : `Missing columns: ${missing.join(', ')}`
    })
  } catch (error) {
    console.error('Error testing columns:', error)
    return NextResponse.json({
      success: false,
      error: 'Failed to test columns'
    }, { status: 500 })
  }
}
