// Simple in-memory store with mock seeds for MVP
export type User = {
  id: string
  role: "founder" | "backer" | "mentor"
  name: string
  bio?: string
  avatar?: string
  state?: string
  sectors?: string[]
  skills?: string[]
  time_commitment?: string
  interests?: string[]
  indicative_ticket_text?: string
  badges?: string[]
  isPro?: boolean
  isPremium?: boolean
  social?: {
    linkedin?: string
    twitter?: string
    instagram?: string
    website?: string
  }
}

export type Idea = {
  id: string
  ownerId: string
  title: string
  oneLiner: string
  category: string
  stage: "Idea" | "MVP" | "Early"
  state: string
  problem?: string
  solution?: string
  traction?: string
  needs?: { capital_text?: string; skills_text?: string; mentor_text?: string }
  milestones?: string[]
  links?: { site?: string; deck?: string }
  tags?: string[]
  boostedUntil?: string | null
  stats?: { views: number; saves: number }
}

export type Message = {
  id: string
  fromId: string
  toId: string
  ideaId?: string
  text: string
  attachments?: string[]
  createdAt: string
}

export const db = {
  users: [] as User[],
  ideas: [] as Idea[],
  messages: [] as Message[],
}

// seeds
db.users.push(
  { id: "u1", role: "founder", name: "Sarah Chen", state: "NSW", sectors: ["Sustainability"], skills: ["design"], interests: ["sustainability","delivery"], badges: ["Founder"], isPro: true, social: { linkedin: "https://linkedin.com/in/sarahchen", instagram: "https://instagram.com/sarahchen", website: "https://ecodelivery.example.com" } },
  { id: "u2", role: "backer", name: "Marcus Williams", state: "VIC", interests: ["edtech","ai"], indicative_ticket_text: "$5k-$25k", badges: ["Backer"], isPremium: true, social: { website: "https://investor-marcus.example.com" } },
  { id: "u3", role: "mentor", name: "Priya Patel", state: "QLD", skills: ["brand","ux"], interests: ["creator economy"], badges: ["Mentor"], social: { twitter: "https://twitter.com/priyapatel" } }
)

db.ideas.push(
  { id: "i1", ownerId: "u1", title: "EcoDelivery", oneLiner: "Greener last-mile delivery", category: "Sustainability", stage: "MVP", state: "NSW", tags: ["sustainability","logistics"], needs: { skills_text: "growth marketing" }, stats: { views: 234, saves: 18 }, boostedUntil: null },
  { id: "i2", ownerId: "u2", title: "StudyBuddy", oneLiner: "AI study companion", category: "EdTech", stage: "Idea", state: "VIC", tags: ["edtech","ai"], needs: { capital_text: "$15k seed" }, stats: { views: 456, saves: 32 }, boostedUntil: "2099-01-01" }
)

db.messages.push(
  { id: "m1", fromId: "u2", toId: "u1", ideaId: "i1", text: "Interested to learn more. Can we chat?", createdAt: new Date().toISOString() }
)

