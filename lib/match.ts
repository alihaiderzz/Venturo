export type Listing = {
  id: string
  category?: string
  stage?: string
  state?: string
  tags?: string[]
  needs?: string[]
}

export type Profile = {
  id: string
  interests?: string[]
  skills?: string[]
  preferredCategories?: string[]
  preferredStages?: string[]
  states?: string[]
}

export type MatchScore = { listingId: string; score: number; reasons: string[] }

export function computeMatchScores(profile: Profile, listings: Listing[]): MatchScore[] {
  const norm = (s: string) => s.trim().toLowerCase()
  const set = (arr?: string[]) => new Set((arr ?? []).map(norm))

  const interestSet = set(profile.interests)
  const skillSet = set(profile.skills)
  const categorySet = set(profile.preferredCategories)
  const stageSet = set(profile.preferredStages)
  const stateSet = set(profile.states)

  return listings
    .map((l) => {
      let score = 0
      const reasons: string[] = []
      const tagSet = set(l.tags)
      const needSet = set(l.needs)
      const cat = l.category ? norm(l.category) : ""
      const stg = l.stage ? norm(l.stage) : ""
      const sta = l.state ? norm(l.state) : ""

      for (const i of interestSet) if (tagSet.has(i)) (score += 3, reasons.push(`Shared sector: ${i}`))
      for (const s of skillSet) if (needSet.has(s)) (score += 4, reasons.push(`Skills match: ${s}`))
      if (cat && categorySet.has(cat)) (score += 2, reasons.push(`Category match: ${l.category}`))
      if (stg && stageSet.has(stg)) (score += 2, reasons.push(`Stage match: ${l.stage}`))
      if (sta && stateSet.has(sta)) (score += 1, reasons.push(`Location match: ${l.state}`))

      return { listingId: l.id, score, reasons: reasons.slice(0, 3) }
    })
    .sort((a, b) => b.score - a.score)
}




