import { notFound } from "next/navigation"
import { db } from "@/lib/store"
import { LegalNotice } from "@/components/LegalNotice"
import { Button } from "@/components/ui/button"
import { ArrowLeft, UserPlus } from "lucide-react"
import Link from "next/link"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

export default async function IdeaDetail({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const idea = db.ideas.find((i) => i.id === id)
  if (!idea) return notFound()
  const founder = db.users.find((u) => u.id === idea.ownerId)
  return (
    <main className="container mx-auto px-4 py-8">
      <div className="mb-6"><LegalNotice /></div>
      <div className="flex items-center space-x-4 mb-6">
        <Button variant="ghost" size="sm" asChild>
          <Link href="/browse" aria-label="Back to browse">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Link>
        </Button>
        <h1 className="text-3xl font-bold">{idea.title}</h1>
      </div>
      <header className="mb-6">
        <p className="text-muted-foreground">{idea.oneLiner}</p>
        <div className="mt-3 text-sm">{idea.category} • {idea.stage} • {idea.state}</div>
        <div className="mt-4 flex gap-2">
          <ConnectButton founder={founder} />
          <Button variant="outline">Save</Button>
          <Button variant="outline">Share</Button>
        </div>
      </header>
      <section className="grid md:grid-cols-3 gap-8">
        <div className="md:col-span-2 space-y-6">
          <div><h2 className="font-semibold mb-2">Problem</h2><p>{idea.problem ?? "TBA"}</p></div>
          <div><h2 className="font-semibold mb-2">Solution</h2><p>{idea.solution ?? "TBA"}</p></div>
          <div><h2 className="font-semibold mb-2">Traction</h2><p>{idea.traction ?? "TBA"}</p></div>
          <div><h2 className="font-semibold mb-2">Needs</h2><p>{idea.needs?.capital_text} {idea.needs?.skills_text} {idea.needs?.mentor_text}</p></div>
          <div><h2 className="font-semibold mb-2">Milestones</h2><ul className="list-disc pl-5">{(idea.milestones ?? []).map((m) => (<li key={m}>{m}</li>))}</ul></div>
          <div><h2 className="font-semibold mb-2">Links</h2><p><a className="underline" href={idea.links?.site || "#"}>Website</a> • <a className="underline" href={idea.links?.deck || "#"}>Deck</a></p></div>
          <div><h2 className="font-semibold mb-2">FAQs</h2><p>TBA</p></div>
        </div>
        <aside className="space-y-4">
          <div className="p-4 border rounded">
            <div className="font-semibold">Founder</div>
            <div className="text-sm">{founder?.name} • {founder?.state}</div>
          </div>
          <div className="p-4 border rounded">
            <div className="font-semibold mb-2">30-sec summary</div>
            <p className="text-sm text-muted-foreground">{idea.oneLiner}</p>
          </div>
          <div className="p-4 border rounded">
            <div className="font-semibold mb-2">Suggested diligence questions</div>
            <ul className="text-sm list-disc pl-5">
              <li>What traction validates {idea.title} today?</li>
              <li>How will you acquire first 100 users in {idea.state}?</li>
              <li>What milestones unlock your next stage from {idea.stage}?</li>
            </ul>
          </div>
        </aside>
      </section>
    </main>
  )
}

function ConnectButton({ founder }: { founder?: any }) {
  const social = founder?.social || {}
  const links: { label: string; url: string }[] = []
  if (social.linkedin) links.push({ label: "LinkedIn", url: social.linkedin })
  if (social.twitter) links.push({ label: "Twitter", url: social.twitter })
  if (social.instagram) links.push({ label: "Instagram", url: social.instagram })
  if (social.website) links.push({ label: "Website", url: social.website })

  const single = links.length === 1 ? links[0] : null

  if (links.length === 0) {
    return (
      <Button variant="outline" disabled>
        <UserPlus className="h-4 w-4 mr-2" />
        No Social Links
      </Button>
    )
  }

  if (single) {
    return (
      <Button asChild variant="outline" aria-label={`Connect via ${single.label}`}>
        <a href={single.url} target="_blank" rel="noreferrer noopener">
          <UserPlus className="h-4 w-4 mr-2" />
          Connect
        </a>
      </Button>
    )
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" aria-label="Connect menu">
          <UserPlus className="h-4 w-4 mr-2" />
          Connect
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start">
        {links.map((link) => (
          <DropdownMenuItem key={link.label} asChild>
            <a href={link.url} target="_blank" rel="noreferrer noopener">
              {link.label}
            </a>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

