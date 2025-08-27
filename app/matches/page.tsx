"use client"
import { useEffect, useState } from "react"
import { db } from "@/lib/store"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import { LegalNotice } from "@/components/LegalNotice"
import Link from "next/link"

type Match = { listingId: string; score: number; reasons: string[] }

export default function MatchesPage() {
  const [matches, setMatches] = useState<Match[]>([])
  useEffect(() => {
    const user = db.users[1]
    const body = { userProfile: { interests: user.interests, skills: user.skills, states: [user.state ?? ""] } }
    fetch("/api/match", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) })
      .then((r) => r.json()).then((d) => setMatches(d.matches || []))
  }, [])
  const rating = (s: number) => (s >= 8 ? "Very strong" : s >= 5 ? "Strong" : "Good")
  return (
    <main className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <LegalNotice />
      </div>
      <div className="flex items-center space-x-4 mb-6">
        <Button variant="ghost" size="sm" asChild>
          <Link href="/" aria-label="Back to home">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Link>
        </Button>
        <h1 className="text-3xl font-bold">Your matches</h1>
      </div>
      <div className="grid md:grid-cols-2 gap-6">
        {matches.map((m) => {
          const idea = db.ideas.find((i) => i.id === m.listingId)
          if (!idea) return null
          return (
            <Card key={m.listingId}>
              <CardHeader><CardTitle>{idea.title} <span className="text-sm text-muted-foreground">— {rating(m.score)}</span></CardTitle></CardHeader>
              <CardContent>
                <div className="text-sm text-muted-foreground mb-2">{idea.category} • {idea.stage} • {idea.state}</div>
                <ul className="list-disc pl-5 text-sm">{m.reasons.map((r) => <li key={r}>{r}</li>)}</ul>
              </CardContent>
            </Card>
          )
        })}
      </div>
    </main>
  )
}

