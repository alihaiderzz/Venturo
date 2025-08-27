import { db } from "@/lib/store"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import { LegalNotice } from "@/components/LegalNotice"
import Link from "next/link"

export default function MessagesPage() {
  const msgs = db.messages
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
        <h1 className="text-3xl font-bold">Messages</h1>
      </div>
      <div className="grid md:grid-cols-3 gap-6">
        <aside className="md:col-span-1 space-y-2">
          {msgs.map((m) => (
            <div key={m.id} className="p-3 border rounded">
              <div className="text-sm font-semibold">From: {db.users.find(u=>u.id===m.fromId)?.name}</div>
              <div className="text-xs text-muted-foreground">{new Date(m.createdAt).toLocaleString()}</div>
            </div>
          ))}
        </aside>
        <section className="md:col-span-2 p-4 border rounded">
          <div className="text-sm text-muted-foreground mb-2">Thread</div>
          {msgs.map((m) => (
            <div key={m.id} className="mb-3">
              <div className="text-sm">{m.text}</div>
              {(m.attachments ?? []).length ? <div className="text-xs text-muted-foreground">{m.attachments?.join(", ")}</div> : null}
            </div>
          ))}
        </section>
      </div>
    </main>
  )
}

