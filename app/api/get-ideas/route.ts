import { createClient } from '@supabase/supabase-js'
import { NextResponse } from "next/server"

// Mock data for development when Supabase is not available
const mockIdeas = [
  {
    id: "1",
    title: "Eco-Friendly Food Delivery",
    one_liner: "Sustainable food delivery service using electric bikes and biodegradable packaging",
    description: "A comprehensive food delivery platform focused on sustainability, using electric bikes for delivery and biodegradable packaging materials.",
    category: "Sustainability",
    stage: "MVP",
    status: "active",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    owner: {
      id: "1",
      full_name: "Sarah Johnson",
      role: "founder",
      location: "Sydney, NSW",
      company: "GreenEats"
    },
    stats: {
      views: 45,
      saves: 12,
      messages: 8
    }
  },
  {
    id: "2", 
    title: "AI-Powered Learning Assistant",
    one_liner: "Personalized AI tutor for students with learning difficulties",
    description: "An AI-powered learning platform that adapts to individual student needs and provides personalized tutoring for students with learning difficulties.",
    category: "Education",
    stage: "Early Traction",
    status: "active",
    created_at: new Date(Date.now() - 86400000).toISOString(),
    updated_at: new Date(Date.now() - 86400000).toISOString(),
    owner: {
      id: "2",
      full_name: "Michael Chen",
      role: "founder", 
      location: "Melbourne, VIC",
      company: "EduAI"
    },
    stats: {
      views: 78,
      saves: 23,
      messages: 15
    }
  },
  {
    id: "3",
    title: "HealthTech Wearable",
    one_liner: "Smart wearable device for monitoring chronic health conditions",
    description: "A revolutionary wearable device that continuously monitors chronic health conditions and provides real-time alerts to patients and healthcare providers.",
    category: "Healthcare",
    stage: "Growth",
    status: "active",
    created_at: new Date(Date.now() - 172800000).toISOString(),
    updated_at: new Date(Date.now() - 172800000).toISOString(),
    owner: {
      id: "3",
      full_name: "Dr. Emma Wilson",
      role: "founder",
      location: "Brisbane, QLD", 
      company: "HealthWear"
    },
    stats: {
      views: 156,
      saves: 34,
      messages: 22
    }
  }
]

export async function GET() {
  try {
    // Try to connect to Supabase first
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    )
    
    const { data, error } = await supabase
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
      // Return mock data if Supabase fails
      return NextResponse.json({ data: mockIdeas })
    }

    return NextResponse.json({ data: data || [] })
  } catch (error) {
    console.error("API error:", error)
    // Return mock data if there's any error
    return NextResponse.json({ data: mockIdeas })
  }
}
