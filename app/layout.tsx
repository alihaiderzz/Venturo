import type React from "react"
import type { Metadata } from "next"
import { Inter, Manrope } from "next/font/google"
import { Analytics } from "@vercel/analytics/react"
import { SpeedInsights } from "@vercel/speed-insights/next"
import { ClerkProvider } from '@clerk/nextjs'
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

const clerkAppearance = {
  baseTheme: undefined,
  variables: {
    colorPrimary: '#21C087', // Venturo Teal
    colorBackground: '#F6F7F9', // Venturo Light BG
    colorInputBackground: '#FFFFFF', // White
    colorText: '#0B1E3C', // Venturo Navy
    colorTextSecondary: '#6B7280', // Muted text
    colorTextOnPrimaryBackground: '#FFFFFF', // White text on teal
    colorNeutral: '#F6F7F9', // Light BG
    colorNeutralAlpha: '#F6F7F9',
    colorSuccess: '#21C087', // Teal for success
    colorWarning: '#F5B800', // Venturo Gold
    colorDanger: '#EF4444', // Red for errors
    colorInputText: '#0B1E3C', // Navy text
    colorInputPlaceholder: '#9CA3AF', // Placeholder text
    borderRadius: '8px',
    fontFamily: 'Inter, system-ui, sans-serif',
    fontSize: '14px',
    fontWeight: {
      normal: '400',
      medium: '500',
      semibold: '600',
      bold: '700',
    },
    spacingUnit: '4px',
    animationDuration: '200ms',
  },
  elements: {
    formButtonPrimary: {
      backgroundColor: '#21C087', // Teal
      color: '#FFFFFF',
      fontSize: '16px',
      fontWeight: '600',
      borderRadius: '8px',
      padding: '12px 24px',
      '&:hover': {
        backgroundColor: '#1BA876', // Darker teal
      },
      '&:focus': {
        backgroundColor: '#1BA876',
        boxShadow: '0 0 0 3px rgba(33, 192, 135, 0.1)',
      },
    },
    formButtonSecondary: {
      backgroundColor: 'transparent',
      color: '#21C087', // Teal
      border: '1px solid #21C087',
      fontSize: '16px',
      fontWeight: '600',
      borderRadius: '8px',
      padding: '12px 24px',
      '&:hover': {
        backgroundColor: '#F0FDF9', // Very light teal
      },
    },
    formFieldInput: {
      backgroundColor: '#FFFFFF',
      border: '1px solid #D1D5DB',
      borderRadius: '8px',
      fontSize: '16px',
      padding: '12px 16px',
      color: '#0B1E3C', // Navy
      '&:focus': {
        borderColor: '#21C087', // Teal
        boxShadow: '0 0 0 3px rgba(33, 192, 135, 0.1)',
      },
    },
    formFieldLabel: {
      fontSize: '14px',
      fontWeight: '600',
      color: '#0B1E3C', // Navy
    },
    socialButtonsBlockButton: {
      backgroundColor: '#FFFFFF',
      border: '1px solid #D1D5DB',
      borderRadius: '8px',
      fontSize: '16px',
      fontWeight: '500',
      color: '#0B1E3C', // Navy
      '&:hover': {
        backgroundColor: '#F9FAFB',
        borderColor: '#9CA3AF',
      },
    },
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <ClerkProvider appearance={clerkAppearance}>
      <html lang="en" className={`${inter.variable} ${manrope.variable} antialiased`}>
        <body className="font-sans">
          {children}
          <Analytics />
          <SpeedInsights />
        </body>
      </html>
    </ClerkProvider>
  )
}
