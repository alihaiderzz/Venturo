import { NextRequest, NextResponse } from "next/server"
import { supabase } from "@/lib/supabaseClient"
import { auth } from "@clerk/nextjs/server"

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
    const { 
      title, 
      one_liner, 
      description, 
      category, 
      stage, 
      needs, 
      links,
      tags,
      images,
      company_logo,
      company_logo_public_id
    } = body

    // Validate required fields
    if (!title || !one_liner || !category) {
      return NextResponse.json(
        { error: "Missing required fields: title, one_liner, category" },
        { status: 400 }
      )
    }

    // Get or create user profile
    let { data: userProfile, error: profileError } = await supabase()
      .from('user_profiles')
      .select('*')
      .eq('clerk_user_id', userId)
      .single()

    if (profileError || !userProfile) {
      // Create user profile if it doesn't exist
      const { data: newProfile, error: createError } = await supabase()
        .from('user_profiles')
        .insert({
          clerk_user_id: userId,
          email: "", // Will be filled by Clerk
          role: "founder", // Default role
          profile_completed: false
        })
        .select()
        .single()

      if (createError) {
        console.error("Error creating user profile:", createError)
        return NextResponse.json(
          { error: "Failed to create user profile" },
          { status: 500 }
        )
      }
      userProfile = newProfile
    }

    if (!userProfile) {
      return NextResponse.json(
        { error: "Failed to create user profile" },
        { status: 500 }
      )
    }

    // Check user's idea limit based on subscription tier
    const { data: userIdeas, error: ideasError } = await supabase()
      .from('startup_ideas')
      .select('id')
      .eq('owner_id', userProfile.id)
      .eq('status', 'active')

    if (ideasError) {
      console.error("Error checking user ideas:", ideasError)
      return NextResponse.json(
        { error: "Failed to check user limits" },
        { status: 500 }
      )
    }

    // Get user's subscription tier
    const subscriptionTier = userProfile.subscription_tier || 'free'
    
    // Set max ideas based on subscription tier
    let maxIdeas = 1 // Free tier
    if (subscriptionTier === 'premium') {
      maxIdeas = 3 // Pro tier
    } else if (subscriptionTier === 'investor') {
      maxIdeas = Infinity // Investor tier - unlimited
    }

    if (userIdeas && userIdeas.length >= maxIdeas && maxIdeas !== Infinity) {
      const tierName = subscriptionTier === 'free' ? 'Free' : 
                      subscriptionTier === 'premium' ? 'Pro' : 'Investor Premium'
      return NextResponse.json(
        { 
          error: `${tierName} users can only post ${maxIdeas} idea${maxIdeas > 1 ? 's' : ''}. Upgrade to post more ideas!`,
          limitReached: true,
          currentIdeas: userIdeas.length,
          maxIdeas: maxIdeas,
          subscriptionTier: subscriptionTier
        },
        { status: 403 }
      )
    }

    // Prepare idea data
    const ideaData = {
      title,
      one_liner,
      description: description || one_liner,
      category,
      stage,
      owner_id: userProfile.id,
      needs: needs || {},
      links: links || {},
      tags: tags || [],
      images: images || [],
      company_logo: company_logo || null,
      company_logo_public_id: company_logo_public_id || null,
      status: 'active'
    }

    // Create startup idea
    const { data: idea, error: createError } = await supabase()
      .from('startup_ideas')
      .insert(ideaData)
      .select()
      .single()

    if (createError || !idea) {
      console.error("Error creating startup idea:", createError)
      return NextResponse.json(
        { error: "Failed to create startup idea" },
        { status: 500 }
      )
    }
    
    return NextResponse.json({ 
      success: true, 
      idea,
      message: "Startup idea created successfully!"
    })
  } catch (error) {
    console.error("API error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}

export async function GET() {
  try {
    const { data: ideas, error } = await supabase()
      .from('startup_ideas')
      .select('*')
      .eq('status', 'active')
      .order('created_at', { ascending: false })
      .limit(50)

    if (error) {
      console.error("Supabase error:", error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ ideas: ideas || [] })
  } catch (error) {
    console.error("API error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
