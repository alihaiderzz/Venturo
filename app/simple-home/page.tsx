"use client"

import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"
import Image from "next/image"

export default function SimpleHomePage() {
  return (
    <div className="min-h-screen bg-background">
      <header className="bg-white border-b border-gray-200 shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <a href="/" aria-label="Venturo home">
                <Image src="/venturo-logo-full.png" alt="Venturo" width={180} height={60} className="h-12 w-auto" />
              </a>
            </div>
            <nav className="hidden md:flex items-center space-x-8">
              <a href="#how-it-works" className="text-foreground hover:text-primary transition-colors font-medium">
                How it Works
              </a>
              <a href="/browse" className="text-foreground hover:text-primary transition-colors font-medium">
                Browse Ideas
              </a>
              <a href="/events" className="text-foreground hover:text-primary transition-colors font-medium">
                Events
              </a>
              <a href="/pricing" className="text-foreground hover:text-primary transition-colors font-medium">
                Pricing
              </a>
            </nav>
          </div>
        </div>
      </header>

      <section className="relative overflow-hidden bg-gradient-to-br from-[#F6F7F9] via-white to-[#F6F7F9]">
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 opacity-5">
          <Image src="/venturo-logo-mark.png" alt="" width={600} height={600} className="w-auto h-80" />
        </div>
        <div className="relative container mx-auto px-4 py-24 lg:py-32">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="font-serif text-5xl lg:text-7xl font-bold mb-6 leading-tight text-foreground">
              Co-own the Future —
              <br />
              <span className="text-[#21C087]">Find Your First Collaborators.</span>
            </h1>
            <p className="text-xl lg:text-2xl mb-8 text-muted-foreground leading-relaxed max-w-3xl mx-auto">
              Venturo is the community where Aussies showcase ideas and meet the right people to build
              together. No gatekeepers, no fuss.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild size="lg" className="bg-[#21C087] hover:bg-[#1a9f6f] text-white font-semibold px-8 py-4 text-lg min-h-11">
                <a href="/create" aria-label="Upload your idea">
                  Upload Your Idea
                  <ArrowRight className="ml-2 h-5 w-5" />
                </a>
              </Button>
              <Button
                asChild
                size="lg"
                variant="outline"
                className="border-[#0B1E3C] text-[#0B1E3C] hover:bg-[#0B1E3C] hover:text-white font-semibold px-8 py-4 text-lg bg-transparent min-h-11"
              >
                <a href="/browse" aria-label="Find startups to back">Find Startups to Back</a>
              </Button>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 bg-muted relative">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="font-serif text-4xl lg:text-5xl font-bold mb-4">How It Works</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Three simple steps to connect with collaborators, mentors, and backers
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <div className="text-center">
              <div className="bg-[#21C087]/10 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-2xl">🚀</span>
              </div>
              <h3 className="font-serif text-2xl font-bold mb-4">Create Profile</h3>
              <p className="text-muted-foreground leading-relaxed">
                Showcase your startup idea and set your needs. Share your vision with Australia's entrepreneurial
                community.
              </p>
            </div>
            <div className="text-center">
              <div className="bg-[#F5B800]/10 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-2xl">👁️</span>
              </div>
              <h3 className="font-serif text-2xl font-bold mb-4">Get Discovered</h3>
              <p className="text-muted-foreground leading-relaxed">
                Potential collaborators, mentors, and backers find your idea. Build connections with people who believe
                in your vision.
              </p>
            </div>
            <div className="text-center">
              <div className="bg-[#0B1E3C]/10 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-2xl">💬</span>
              </div>
              <h3 className="font-serif text-2xl font-bold mb-4">Connect & Build</h3>
              <p className="text-muted-foreground leading-relaxed">
                Start conversations, share resources, and build your startup together. Turn ideas into reality with
                the right team.
              </p>
            </div>
          </div>
        </div>
      </section>

      <footer className="bg-[#0B1E3C] text-white py-12">
        <div className="container mx-auto px-4 text-center">
          <p>&copy; 2025 Venturo. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}
