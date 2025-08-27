export const runtime = "edge"

export async function POST(req: Request) {
  try {
    const { notes } = await req.json()
    const pitch = {
      oneLiner: "AI-powered study companion for uni students",
      problem: "Students struggle with consistent study habits and personalised guidance.",
      solution: "An AI copilot that builds study plans, explains concepts, and tracks progress.",
      traction: "500 signups waitlist; 50 weekly active testers.",
      needs: { capital_text: "$15k seed", skills_text: "Mobile engineer, Growth", mentor_text: "EdTech" },
    }
    return new Response(JSON.stringify({ pitch, notes: notes || "" }), { headers: { "Content-Type": "application/json" } })
  } catch {
    return new Response(JSON.stringify({ error: "Bad Request" }), { status: 400 })
  }
}




