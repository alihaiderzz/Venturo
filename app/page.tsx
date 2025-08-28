"use client"

import { Button } from "@/components/ui/button"
import { SignInButton, SignUpButton, SignedIn, SignedOut } from '@clerk/nextjs'
import { CustomUserButton } from '@/components/CustomUserButton'
import { ArrowRight, Rocket, Target, Shield, Zap } from "lucide-react"
import Link from "next/link"

export default function Home() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-[#21C087]">Venturo</h1>
            </div>
            <nav className="hidden md:flex items-center space-x-8">
              <a href="#how-it-works" className="text-foreground hover:text-primary transition-colors font-medium">
                How it Works
              </a>
              <a href="/browse" className="text-foreground hover:text-primary transition-colors font-medium">
                Browse Ideas
              </a>
              <a href="/pricing" className="text-foreground hover:text-primary transition-colors font-medium">
                Pricing
              </a>
              <SignedOut>
                <SignInButton>
                  <Button variant="outline" className="font-medium bg-transparent">
                    Sign In
                  </Button>
                </SignInButton>
                <SignUpButton>
                  <Button className="bg-[#21C087] hover:bg-[#1a9f6f] text-white font-medium">
                    Get Started
                  </Button>
                </SignUpButton>
              </SignedOut>
              <SignedIn>
                <CustomUserButton />
              </SignedIn>
            </nav>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-[#F6F7F9] via-white to-[#F6F7F9]">
        <div className="container mx-auto px-4 py-16 sm:py-20 lg:py-32">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-4 sm:mb-6 leading-tight text-foreground">
              Co-own the Future —
              <br />
              <span className="text-[#21C087]">Find Your First Collaborators.</span>
            </h1>
            <p className="text-lg sm:text-xl lg:text-2xl mb-6 sm:mb-8 text-muted-foreground leading-relaxed max-w-3xl mx-auto px-4">
              Venturo is the community where Aussies showcase ideas and meet the right people to build
              together. No gatekeepers, no fuss.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center px-4">
              <Button asChild size="lg" className="bg-[#21C087] hover:bg-[#1a9f6f] text-white font-semibold px-6 sm:px-8 py-3 sm:py-4 text-base sm:text-lg min-h-11">
                <Link href="/create" aria-label="Upload your idea">
                  Upload Your Idea
                  <ArrowRight className="ml-2 h-4 w-4 sm:h-5 sm:w-5" />
                </Link>
              </Button>
              <Button
                asChild
                size="lg"
                variant="outline"
                className="border-[#0B1E3C] text-[#0B1E3C] hover:bg-[#0B1E3C] hover:text-white font-semibold px-6 sm:px-8 py-3 sm:py-4 text-base sm:text-lg bg-transparent min-h-11"
              >
                <Link href="/browse" aria-label="Find startups to back">Find Startups to Back</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-12 sm:py-16 lg:py-20 bg-muted relative">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12 sm:mb-16">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-3 sm:mb-4">How It Works</h2>
            <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto px-4">
              Three simple steps to connect with collaborators, mentors, and backers
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 sm:gap-12 max-w-5xl mx-auto">
            <div className="text-center">
              <div className="bg-[#21C087]/10 w-16 h-16 sm:w-20 sm:h-20 rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6">
                <Rocket className="h-8 w-8 sm:h-10 sm:w-10 text-[#21C087]" />
              </div>
              <h3 className="text-xl sm:text-2xl font-bold mb-3 sm:mb-4">Create Profile</h3>
              <p className="text-muted-foreground leading-relaxed text-sm sm:text-base px-2">
                Showcase your startup idea and set your needs. Share your vision with Australia's entrepreneurial
                community.
              </p>
            </div>
            <div className="text-center">
              <div className="bg-[#F5B800]/10 w-16 h-16 sm:w-20 sm:h-20 rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6">
                <Target className="h-8 w-8 sm:h-10 sm:w-10 text-[#F5B800]" />
              </div>
              <h3 className="text-xl sm:text-2xl font-bold mb-3 sm:mb-4">Get Discovered</h3>
              <p className="text-muted-foreground leading-relaxed text-sm sm:text-base px-2">
                Potential collaborators, mentors, and backers find your idea. Build connections with people who believe
                in your vision.
              </p>
            </div>
            <div className="text-center">
              <div className="bg-[#0B1E3C]/10 w-16 h-16 sm:w-20 sm:h-20 rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6">
                <Shield className="h-8 w-8 sm:h-10 sm:w-10 text-[#0B1E3C]" />
              </div>
              <h3 className="text-xl sm:text-2xl font-bold mb-3 sm:mb-4">Chat & Collaborate</h3>
              <p className="text-muted-foreground leading-relaxed text-sm sm:text-base px-2">
                Connect directly through our platform. Negotiate partnerships, mentorship, and backing arrangements
                privately.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-[#0B1E3C] to-[#21C087] relative overflow-hidden">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl lg:text-6xl font-bold text-white mb-6">
            Your idea deserves the right people.
            <br />
            <span className="text-white/90">Your network deserves to grow.</span>
          </h2>
          <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
            Join Australia's most exciting founder community today.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg" className="bg-white text-[#0B1E3C] hover:bg-white/90 font-semibold px-8 py-4 text-lg min-h-11">
              <Link href="/create" aria-label="Upload your idea">
                Upload Your Idea
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="border-white text-white hover:bg-white hover:text-[#0B1E3C] font-semibold px-8 py-4 text-lg bg-transparent min-h-11"
            >
              <Link href="/browse" aria-label="Find startups to back">Find Startups to Back</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-foreground text-white py-12">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <h3 className="text-2xl font-bold mb-4">Venturo</h3>
            <p className="text-white/80 mb-4">Co-own the future. Find your collaborators.</p>
            <div className="flex justify-center space-x-6">
              <Link href="/about" className="text-white/80 hover:text-white transition-colors">
                About
              </Link>
              <Link href="/contact" className="text-white/80 hover:text-white transition-colors">
                Contact
              </Link>
              <Link href="/legal" className="text-white/80 hover:text-white transition-colors">
                Legal
              </Link>
            </div>
          </div>
          <div className="border-t border-white/20 mt-8 pt-8 text-center text-white/60">
            <p className="text-sm sm:text-base px-4">
              © 2025 Venturo. Venturo is a networking platform only. We do not facilitate investments or hold an AFSL.
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}


