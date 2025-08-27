import type { MetadataRoute } from "next"

export default function sitemap(): MetadataRoute.Sitemap {
  const base = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"
  return [
    { url: `${base}/`, changeFrequency: "weekly", priority: 1.0 },
    { url: `${base}/browse`, changeFrequency: "weekly", priority: 0.8 },
    { url: `${base}/idea/i1`, changeFrequency: "weekly", priority: 0.7 },
    { url: `${base}/create`, changeFrequency: "monthly", priority: 0.6 },
    { url: `${base}/u/u1`, changeFrequency: "monthly", priority: 0.5 },
    { url: `${base}/matches`, changeFrequency: "weekly", priority: 0.7 },
    { url: `${base}/messages`, changeFrequency: "weekly", priority: 0.6 },
    { url: `${base}/pricing`, changeFrequency: "monthly", priority: 0.7 },
    { url: `${base}/events`, changeFrequency: "monthly", priority: 0.5 },
    { url: `${base}/resources`, changeFrequency: "yearly", priority: 0.4 },
    { url: `${base}/legal`, changeFrequency: "yearly", priority: 0.4 },
  ]
}




