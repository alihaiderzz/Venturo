import type React from "react"
import type { Metadata } from "next"
import { Inter, Manrope } from "next/font/google"
import { Analytics } from "@vercel/analytics/react"
import { SpeedInsights } from "@vercel/speed-insights/next"
import "./globals.css"

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
})

const manrope = Manrope({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-manrope",
})

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"),
  title: "Venturo - Co-own the Future. Find Your First Collaborators.",
  description:
    "The community where Aussies showcase ideas and meet the right people to build together. Find collaborators, mentors, and backers.",
  generator: "v0.app",
  openGraph: {
    title: "Venturo - Co-own the Future",
    description:
      "Showcase ideas and meet collaborators, mentors, and backers across Australia.",
    url: process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000",
    siteName: "Venturo",
    images: [{ url: "/venturo-logo-full.png", width: 1200, height: 630, alt: "Venturo" }],
    locale: "en_AU",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Venturo - Co-own the Future",
    description:
      "Showcase ideas and meet collaborators, mentors, and backers across Australia.",
    images: ["/venturo-logo-full.png"],
  },
  robots: { index: true, follow: true },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${manrope.variable} antialiased`}>
      <body className="font-sans">
        {children}
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  )
}
