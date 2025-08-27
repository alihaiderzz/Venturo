import { computeMatchScores, type Listing, type Profile } from "@/lib/match"
import { db } from "@/lib/store"

export const runtime = "edge"

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const profile: Profile = body.userProfile
    const listings: Listing[] =
      body.listings ??
      db.ideas.map((i) => ({
        id: i.id,
        category: i.category,
        stage: i.stage,
        state: i.state,
        tags: i.tags,
        needs: [
          ...(i.needs?.skills_text ? i.needs.skills_text.split(/[\,\s]+/) : []),
          ...(i.needs?.mentor_text ? i.needs.mentor_text.split(/[\,\s]+/) : []),
        ],
      }))
    if (!profile) return new Response(JSON.stringify({ error: "Invalid payload" }), { status: 400 })
    const matches = computeMatchScores(profile, listings)
    return new Response(JSON.stringify({ matches }), { headers: { "Content-Type": "application/json" } })
  } catch {
    return new Response(JSON.stringify({ error: "Bad Request" }), { status: 400 })
  }
}




