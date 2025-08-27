import { createClient } from '@supabase/supabase-js'

// Lazy initialization to avoid build-time errors
let supabaseClient: ReturnType<typeof createClient> | null = null

export const supabase = () => {
  if (!supabaseClient) {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    
    if (!supabaseUrl || !supabaseAnonKey) {
      throw new Error('Supabase environment variables are not configured')
    }
    
    supabaseClient = createClient(supabaseUrl, supabaseAnonKey)
  }
  return supabaseClient
}

// TypeScript types for our database schema
export interface UserProfile {
  id: string
  clerk_user_id: string
  email: string
  full_name?: string
  role?: 'founder' | 'creator' | 'backer'
  bio?: string
  location?: string
  website?: string
  company?: string
  state?: string
  sectors?: string[]
  skills?: string[]
  time_commitment?: string
  indicative_ticket?: string
  social_links?: Record<string, string>
  profile_completed: boolean
  created_at: string
  updated_at: string
}

export interface Event {
  id: string
  title: string
  description: string
  date: string
  time_start: string
  time_end: string
  location: string
  category: string
  max_attendees?: number
  current_attendees: number
  is_venturo_hosted: boolean
  status: 'upcoming' | 'ongoing' | 'completed' | 'cancelled'
  organizer_id?: string
  organizer_name?: string
  organizer_email?: string
  external_link?: string
  ai_generated_tags?: string[]
  ai_summary?: string
  created_at: string
  updated_at: string
}

export interface StartupIdea {
  id: string
  title: string
  one_liner: string
  description?: string
  category: string
  stage?: string
  owner_id?: string
  needs?: Record<string, any>
  stats?: {
    views: number
    saves: number
    messages: number
  }
  boosted_until?: string
  ai_generated_tags?: string[]
  ai_summary?: string
  status: 'active' | 'inactive' | 'completed'
  created_at: string
  updated_at: string
}

export interface Message {
  id: string
  sender_id: string
  receiver_id: string
  idea_id?: string
  subject?: string
  content: string
  read_at?: string
  created_at: string
}

export interface EventAttendee {
  id: string
  event_id: string
  user_id: string
  status: 'registered' | 'attended' | 'cancelled'
  created_at: string
}

// Helper functions for common database operations
export const db = {
  // User Profile operations
  async getUserProfile(clerkUserId: string): Promise<UserProfile | null> {
    const { data, error } = await supabase()
      .from('user_profiles')
      .select('*')
      .eq('clerk_user_id', clerkUserId)
      .single()
    
    if (error) {
      console.error('Error fetching user profile:', error)
      return null
    }
    
    return data
  },

  async createUserProfile(profile: Partial<UserProfile>): Promise<UserProfile | null> {
    console.log('Creating user profile with data:', profile)
    const { data, error } = await supabase()
      .from('user_profiles')
      .insert(profile)
      .select()
      .single()
    
    if (error) {
      console.error('Error creating user profile:', error)
      return null
    }
    
    console.log('Created user profile:', data)
    return data
  },

  async updateUserProfile(clerkUserId: string, updates: Partial<UserProfile>): Promise<UserProfile | null> {
    console.log('Updating user profile for:', clerkUserId, 'with data:', updates)
    const { data, error } = await supabase()
      .from('user_profiles')
      .update(updates)
      .eq('clerk_user_id', clerkUserId)
      .select()
      .single()
    
    if (error) {
      console.error('Error updating user profile:', error)
      return null
    }
    
    console.log('Updated user profile:', data)
    return data
  },

  // Event operations
  async getEvents(filters?: {
    isVenturoHosted?: boolean
    category?: string
    status?: string
    limit?: number
  }): Promise<Event[]> {
    let query = supabase()
      .from('events')
      .select('*')
      .order('date', { ascending: true })
    
    if (filters?.isVenturoHosted !== undefined) {
      query = query.eq('is_venturo_hosted', filters.isVenturoHosted)
    }
    
    if (filters?.category) {
      query = query.eq('category', filters.category)
    }
    
    if (filters?.status) {
      query = query.eq('status', filters.status)
    }
    
    if (filters?.limit) {
      query = query.limit(filters.limit)
    }
    
    const { data, error } = await query
    
    if (error) {
      console.error('Error fetching events:', error)
      return []
    }
    
    return data || []
  },

  async createEvent(event: Partial<Event>): Promise<Event | null> {
    const { data, error } = await supabase()
      .from('events')
      .insert(event)
      .select()
      .single()
    
    if (error) {
      console.error('Error creating event:', error)
      return null
    }
    
    return data
  },

  async registerForEvent(eventId: string, userId: string): Promise<boolean> {
    const { error } = await supabase()
      .from('event_attendees')
      .insert({
        event_id: eventId,
        user_id: userId
      })
    
    if (error) {
      console.error('Error registering for event:', error)
      return false
    }
    
    // Update attendee count
    await supabase().rpc('increment_event_attendees', { event_id: eventId })
    
    return true
  },

  // Startup Idea operations
  async getStartupIdeas(filters?: {
    category?: string
    ownerId?: string
    status?: string
    limit?: number
  }): Promise<StartupIdea[]> {
    let query = supabase()
      .from('startup_ideas')
      .select('*')
      .order('created_at', { ascending: false })
    
    if (filters?.category) {
      query = query.eq('category', filters.category)
    }
    
    if (filters?.ownerId) {
      query = query.eq('owner_id', filters.ownerId)
    }
    
    if (filters?.status) {
      query = query.eq('status', filters.status)
    }
    
    if (filters?.limit) {
      query = query.limit(filters.limit)
    }
    
    const { data, error } = await query
    
    if (error) {
      console.error('Error fetching startup ideas:', error)
      return []
    }
    
    return data || []
  },

  async createStartupIdea(idea: Partial<StartupIdea>): Promise<StartupIdea | null> {
    const { data, error } = await supabase()
      .from('startup_ideas')
      .insert(idea)
      .select()
      .single()
    
    if (error) {
      console.error('Error creating startup idea:', error)
      return null
    }
    
    return data
  },

  async incrementIdeaViews(ideaId: string): Promise<void> {
    await supabase().rpc('increment_idea_views', { idea_id: ideaId })
  },

  // Message operations
  async getMessages(userId: string): Promise<Message[]> {
    const { data, error } = await supabase()
      .from('messages')
      .select('*')
      .or(`sender_id.eq.${userId},receiver_id.eq.${userId}`)
      .order('created_at', { ascending: false })
    
    if (error) {
      console.error('Error fetching messages:', error)
      return []
    }
    
    return data || []
  },

  async sendMessage(message: Partial<Message>): Promise<Message | null> {
    const { data, error } = await supabase()
      .from('messages')
      .insert(message)
      .select()
      .single()
    
    if (error) {
      console.error('Error sending message:', error)
      return null
    }
    
    return data
  },

  // Real-time subscriptions
  subscribeToEvents(callback: (payload: any) => void) {
    return supabase()
      .channel('events')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'events' }, callback)
      .subscribe()
  },

  subscribeToMessages(userId: string, callback: (payload: any) => void) {
    return supabase()
      .channel(`messages:${userId}`)
      .on('postgres_changes', { 
        event: '*', 
        schema: 'public', 
        table: 'messages',
        filter: `sender_id=eq.${userId} OR receiver_id=eq.${userId}`
      }, callback)
      .subscribe()
  }
}
