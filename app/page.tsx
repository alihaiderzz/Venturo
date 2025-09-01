"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowRight, Shield, Rocket, Target, Zap, Menu, MessageCircle, Eye, Heart, UserPlus, X } from "lucide-react"
import Image from "next/image"
import { LegalNotice } from "@/components/LegalNotice"
import { SignInButton, SignUpButton, SignedIn, SignedOut } from '@clerk/nextjs'
import { UserProfileButton } from '@/components/UserProfileButton'
import { useState } from 'react'

export default function HomePage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <div className="min-h-screen bg-background">
      <header className="bg-white/95 backdrop-blur-sm border-b border-gray-200 shadow-sm sticky top-0 z-40">
        <div className="container mx-auto px-4 py-3 sm:py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <a href="/" aria-label="Venturo home" className="hover:opacity-80 transition-opacity">
                <Image src="/venturo-logo-full.png" alt="Venturo" width={180} height={60} className="h-10 sm:h-12 w-auto" />
              </a>
            </div>
            <nav className="hidden md:flex items-center space-x-6 lg:space-x-8">
              <a href="#how-it-works" className="text-foreground hover:text-primary transition-colors font-medium text-sm lg:text-base">
                How it Works
              </a>
              <a href="#why-venturo" className="text-foreground hover:text-primary transition-colors font-medium text-sm lg:text-base">
                Why Venturo
              </a>
              <a href="/browse" className="text-foreground hover:text-primary transition-colors font-medium text-sm lg:text-base">
                Browse Ideas
              </a>
              <a href="/events" className="text-foreground hover:text-primary transition-colors font-medium text-sm lg:text-base">
                Events
              </a>
              <a href="/pricing" className="text-foreground hover:text-primary transition-colors font-medium text-sm lg:text-base">
                Pricing
              </a>
              <SignedOut>
                <div className="flex items-center space-x-3">
                  <SignInButton>
                    <Button variant="outline" className="font-medium bg-transparent text-sm lg:text-base px-3 lg:px-4">
                      Sign In
                    </Button>
                  </SignInButton>
                  <SignUpButton>
                    <Button className="bg-[#21C087] hover:bg-[#1a9f6f] text-white font-medium text-sm lg:text-base px-3 lg:px-4">
                      Get Started
                    </Button>
                  </SignUpButton>
                </div>
              </SignedOut>
              <SignedIn>
                <UserProfileButton />
              </SignedIn>
            </nav>
            <div className="md:hidden flex items-center space-x-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-2"
              >
                {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Menu Overlay */}
      {mobileMenuOpen && (
        <div className="md:hidden fixed inset-0 z-50 bg-black/50 backdrop-blur-sm">
          <div className="bg-white h-full w-80 max-w-[85vw] shadow-2xl transform transition-transform duration-300 ease-in-out">
            <div className="flex items-center justify-between p-4 border-b bg-gradient-to-r from-gray-50 to-white">
              <Image src="/venturo-logo-full.png" alt="Venturo" width={140} height={40} className="h-8 w-auto" />
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setMobileMenuOpen(false)}
                className="p-2 hover:bg-gray-100 rounded-full"
              >
                <X className="h-5 w-5" />
              </Button>
            </div>
            <nav className="p-4 space-y-2">
              <a 
                href="#how-it-works" 
                className="block text-foreground hover:text-primary transition-colors font-medium py-3 px-3 rounded-lg hover:bg-gray-50"
                onClick={() => setMobileMenuOpen(false)}
              >
                How it Works
              </a>
              <a 
                href="#why-venturo" 
                className="block text-foreground hover:text-primary transition-colors font-medium py-3 px-3 rounded-lg hover:bg-gray-50"
                onClick={() => setMobileMenuOpen(false)}
              >
                Why Venturo
              </a>
              <a 
                href="/browse" 
                className="block text-foreground hover:text-primary transition-colors font-medium py-3 px-3 rounded-lg hover:bg-gray-50"
                onClick={() => setMobileMenuOpen(false)}
              >
                Browse Ideas
              </a>
              <a 
                href="/events" 
                className="block text-foreground hover:text-primary transition-colors font-medium py-3 px-3 rounded-lg hover:bg-gray-50"
                onClick={() => setMobileMenuOpen(false)}
              >
                Events
              </a>
              <a 
                href="/pricing" 
                className="block text-foreground hover:text-primary transition-colors font-medium py-3 px-3 rounded-lg hover:bg-gray-50"
                onClick={() => setMobileMenuOpen(false)}
              >
                Pricing
              </a>
              <div className="pt-4 border-t">
                <SignedOut>
                  <div className="space-y-3">
                    <SignInButton>
                      <Button variant="outline" className="w-full font-medium">
                        Sign In
                      </Button>
                    </SignInButton>
                    <SignUpButton>
                      <Button className="w-full bg-[#21C087] hover:bg-[#1a9f6f] text-white font-medium">
                        Get Started
                      </Button>
                    </SignUpButton>
                  </div>
                </SignedOut>
                <SignedIn>
                  <div className="flex justify-center">
                    <UserProfileButton />
                  </div>
                </SignedIn>
              </div>
            </nav>
          </div>
        </div>
      )}

      <section className="relative overflow-hidden bg-gradient-to-br from-[#F6F7F9] via-white to-[#F6F7F9]">
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 opacity-5">
          <Image src="/venturo-logo-mark.png" alt="" width={600} height={600} className="w-auto h-80" />
        </div>
        <div className="absolute top-20 right-20 opacity-10 animate-pulse">
          <Image src="/venturo-logo-mark.png" alt="" width={80} height={80} className="w-16 h-16" />
        </div>
        <div className="absolute bottom-32 left-20 opacity-10 animate-pulse delay-1000">
          <Image src="/venturo-logo-mark.png" alt="" width={60} height={60} className="w-12 h-12" />
        </div>
        <div className="relative container mx-auto px-4 py-12 sm:py-16 lg:py-24 xl:py-32">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="font-serif text-2xl sm:text-3xl md:text-4xl lg:text-6xl xl:text-7xl font-bold mb-4 sm:mb-6 leading-tight text-foreground">
              Co-own the Future —
              <br />
              <span className="text-[#21C087]">Find Your First Collaborators.</span>
            </h1>
            <p className="text-base sm:text-lg md:text-xl lg:text-2xl mb-6 sm:mb-8 text-muted-foreground leading-relaxed max-w-3xl mx-auto px-2 sm:px-4">
              Venturo is the community where Aussies showcase ideas and meet the right people to build
              together. No gatekeepers, no fuss.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center px-2 sm:px-4">
              <Button asChild size="lg" className="bg-[#21C087] hover:bg-[#1a9f6f] text-white font-semibold px-4 sm:px-6 lg:px-8 py-3 sm:py-4 text-sm sm:text-base lg:text-lg min-h-11 shadow-lg hover:shadow-xl transition-all duration-200">
                <a href="/create" aria-label="Upload your idea">
                  Upload Your Idea
                  <ArrowRight className="ml-2 h-4 w-4 sm:h-5 sm:w-5" />
                </a>
              </Button>
              <Button
                asChild
                size="lg"
                variant="outline"
                className="border-[#0B1E3C] text-[#0B1E3C] hover:bg-[#0B1E3C] hover:text-white font-semibold px-4 sm:px-6 lg:px-8 py-3 sm:py-4 text-sm sm:text-base lg:text-lg bg-transparent min-h-11 shadow-lg hover:shadow-xl transition-all duration-200"
              >
                <a href="/browse" aria-label="Find startups to back">Find Startups to Back</a>
              </Button>
            </div>
            <div className="mt-8">
              <LegalNotice />
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-12 sm:py-16 lg:py-20 bg-muted relative">
        <div className="absolute top-10 right-10 opacity-5 hidden sm:block">
          <Image src="/venturo-logo-mark.png" alt="" width={120} height={120} className="w-16 h-16 sm:w-24 sm:h-24" />
        </div>
        <div className="container mx-auto px-4">
          <div className="text-center mb-12 sm:mb-16">
            <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold mb-3 sm:mb-4">How It Works</h2>
            <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto px-4">
              Three simple steps to connect with collaborators, mentors, and backers
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 sm:gap-12 max-w-5xl mx-auto">
            <div className="text-center">
              <div className="bg-[#21C087]/10 w-16 h-16 sm:w-20 sm:h-20 rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6">
                <Rocket className="h-8 w-8 sm:h-10 sm:w-10 text-[#21C087]" />
              </div>
              <h3 className="font-serif text-xl sm:text-2xl font-bold mb-3 sm:mb-4">Create Profile</h3>
              <p className="text-muted-foreground leading-relaxed text-sm sm:text-base px-2">
                Showcase your startup idea and set your needs. Share your vision with Australia's entrepreneurial
                community.
              </p>
            </div>
            <div className="text-center">
              <div className="bg-[#F5B800]/10 w-16 h-16 sm:w-20 sm:h-20 rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6">
                <Eye className="h-8 w-8 sm:h-10 sm:w-10 text-[#F5B800]" />
              </div>
              <h3 className="font-serif text-xl sm:text-2xl font-bold mb-3 sm:mb-4">Get Discovered</h3>
              <p className="text-muted-foreground leading-relaxed text-sm sm:text-base px-2">
                Potential collaborators, mentors, and backers find your idea. Build connections with people who believe
                in your vision.
              </p>
            </div>
            <div className="text-center">
              <div className="bg-[#0B1E3C]/10 w-16 h-16 sm:w-20 sm:h-20 rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6">
                <MessageCircle className="h-8 w-8 sm:h-10 sm:w-10 text-[#0B1E3C]" />
              </div>
              <h3 className="font-serif text-xl sm:text-2xl font-bold mb-3 sm:mb-4">Chat & Collaborate</h3>
              <p className="text-muted-foreground leading-relaxed text-sm sm:text-base px-2">
                Connect directly through our platform. Negotiate partnerships, mentorship, and backing arrangements
                privately.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Why Venturo Section */}
      <section id="why-venturo" className="py-12 sm:py-16 lg:py-20 relative">
        <div className="absolute bottom-10 left-10 opacity-5 hidden sm:block">
          <Image src="/venturo-logo-mark.png" alt="" width={100} height={100} className="w-16 h-16 sm:w-20 sm:h-20" />
        </div>
        <div className="container mx-auto px-4">
          <div className="text-center mb-12 sm:mb-16">
            <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold mb-3 sm:mb-4">Why Venturo?</h2>
            <p className="text-lg sm:text-xl text-muted-foreground max-w-3xl mx-auto px-4">
              A networking and showcase platform designed specifically for aspiring Australian founders to find the right
              people to build with.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            <Card className="border-2 hover:border-[#21C087]/50 transition-colors">
              <CardHeader>
                <div className="bg-[#21C087]/10 w-16 h-16 rounded-lg flex items-center justify-center mb-4">
                  <Target className="h-8 w-8 text-[#21C087]" />
                </div>
                <CardTitle className="font-serif text-2xl">For Founders</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base leading-relaxed">
                  Get exposure and find collaborators. Connect with co-founders, mentors, and early backers who want to
                  be part of your journey.
                </CardDescription>
              </CardContent>
            </Card>
            <Card className="border-2 hover:border-[#21C087]/50 transition-colors">
              <CardHeader>
                <div className="bg-[#0B1E3C]/10 w-16 h-16 rounded-lg flex items-center justify-center mb-4">
                  <Shield className="h-8 w-8 text-[#0B1E3C]" />
                </div>
                <CardTitle className="font-serif text-2xl">For Backers</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base leading-relaxed">
                  Get early access to talent and ideas. Discover promising startups and founders before they hit the
                  mainstream.
                </CardDescription>
              </CardContent>
            </Card>
            <Card className="border-2 hover:border-[#21C087]/50 transition-colors">
              <CardHeader>
                <div className="bg-[#F5B800]/10 w-16 h-16 rounded-lg flex items-center justify-center mb-4">
                  <Zap className="h-8 w-8 text-[#F5B800]" />
                </div>
                <CardTitle className="font-serif text-2xl">For Creators</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base leading-relaxed">
                  Offer your skills for equity or paid gigs. Connect with startups that need your expertise and grow
                  together.
                </CardDescription>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Featured Ideas Section */}
      <section id="startups" className="py-20 bg-muted relative">
        <div className="absolute top-10 left-10 opacity-5">
          <Image src="/venturo-logo-mark.png" alt="" width={80} height={80} className="w-16 h-16" />
        </div>
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="font-serif text-4xl lg:text-5xl font-bold mb-4">Featured Ideas</h2>
            <p className="text-xl text-muted-foreground">Discover the next generation of Australian startup ideas</p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {/* Mock Featured Ideas - Replace with real data when available */}
            {[
              {
                id: "mock-1",
                title: "EcoDelivery Network",
                oneLiner: "Sustainable last-mile delivery using electric bikes and local partnerships",
                category: "Sustainability",
                needs: { capital_text: "Seeking $50K for pilot program" },
                boostedUntil: new Date(Date.now() + 86400000),
                stats: { views: 127, saves: 23 }
              },
              {
                id: "mock-2", 
                title: "HealthTech AI Platform",
                oneLiner: "AI-powered early disease detection through smartphone camera analysis",
                category: "Healthcare",
                needs: { skills_text: "Looking for ML engineers and medical advisors" },
                boostedUntil: new Date(Date.now() + 172800000),
                stats: { views: 89, saves: 15 }
              },
              {
                id: "mock-3",
                title: "EdTech Learning Hub",
                oneLiner: "Personalized learning platform for Australian students with AI tutors",
                category: "Education", 
                needs: { mentor_text: "Seeking education industry mentors" },
                boostedUntil: null,
                stats: { views: 156, saves: 31 }
              }
            ].map((idea) => (
              <Card key={idea.id} className="hover:shadow-lg transition-shadow cursor-pointer group">
                <CardHeader>
                  <div className="w-full h-32 bg-gradient-to-br from-primary/20 to-accent/20 rounded-lg mb-4 flex items-center justify-center relative overflow-hidden">
                    <div className="absolute top-2 right-2 opacity-20">
                      <Image src="/venturo-logo-mark.png" alt="" width={24} height={24} className="w-6 h-6" />
                    </div>
                    {idea.boostedUntil && (
                      <div className="absolute top-2 left-2 bg-[#F5B800] text-[#0B1E3C] text-xs px-2 py-1 rounded-full font-medium">
                        Boosted
                      </div>
                    )}
                    <div className="text-2xl font-bold text-primary">{idea.title[0]}</div>
                  </div>
                  <div className="flex items-center justify-between mb-2">
                    <CardTitle className="font-serif text-xl">{idea.title}</CardTitle>
                    <div className="flex items-center gap-3 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Eye className="h-3 w-3" />
                        {idea.stats?.views ?? 0}
                      </div>
                      <div className="flex items-center gap-1">
                        <Heart className="h-3 w-3" />
                        {idea.stats?.saves ?? 0}
                      </div>
                    </div>
                  </div>
                  <CardDescription className="text-[#21C087] font-medium">{idea.category}</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground mb-3">{idea.oneLiner}</p>
                  <div className="bg-muted/50 p-3 rounded-lg mb-4">
                    <p className="text-sm text-foreground font-medium">{idea.needs?.capital_text || idea.needs?.skills_text || idea.needs?.mentor_text || ""}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button asChild className="h-11 min-h-11 flex-1">
                      <a href="/browse" aria-label="Browse all ideas">
                        Browse Ideas
                      </a>
                    </Button>
                    <Button variant="outline" className="h-11 min-h-11" aria-label="Save idea">
                      <Heart className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 bg-gradient-to-r from-[#0B1E3C] to-[#21C087] relative overflow-hidden">
        <div className="absolute top-1/2 right-10 transform -translate-y-1/2 opacity-10">
          <Image src="/venturo-logo-mark.png" alt="" width={300} height={300} className="w-60 h-60" />
        </div>
        <div className="container mx-auto px-4 text-center">
          <h2 className="font-serif text-4xl lg:text-6xl font-bold text-white mb-6">
            Your idea deserves the right people.
            <br />
            <span className="text-white/90">Your network deserves to grow.</span>
          </h2>
          <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
            Join Australia's most exciting founder community today.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg" className="bg-white text-[#0B1E3C] hover:bg-white/90 font-semibold px-8 py-4 text-lg min-h-11">
              <a href="/create" aria-label="Upload your idea">
                Upload Your Idea
                <ArrowRight className="ml-2 h-5 w-5" />
              </a>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="border-white text-white hover:bg-white hover:text-[#0B1E3C] font-semibold px-8 py-4 text-lg bg-transparent min-h-11"
            >
              <a href="/browse" aria-label="Find startups to back">Find Startups to Back</a>
            </Button>
          </div>
        </div>
      </section>

      <footer className="bg-foreground text-white py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            <div>
              <Image
                src="/venturo-logo-full.png"
                alt="Venturo"
                width={140}
                height={48}
                className="h-10 w-auto mb-4 brightness-0 invert"
              />
              <p className="text-white/80">Co-own the future. Find your collaborators.</p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Platform</h4>
              <ul className="space-y-2 text-white/80">
                <li>
                  <a href="#how-it-works" className="hover:text-accent transition-colors">
                    How it Works
                  </a>
                </li>
                <li>
                  <a href="#why-venturo" className="hover:text-accent transition-colors">
                    For Founders
                  </a>
                </li>
                <li>
                  <a href="#startups" className="hover:text-accent transition-colors">
                    Browse Ideas
                  </a>
                </li>
                <li>
                  <a href="/events" className="hover:text-accent transition-colors">
                    Events
                  </a>
                </li>
                <li>
                  <a href="/pricing" className="hover:text-accent transition-colors">
                    Pricing
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Company</h4>
              <ul className="space-y-2 text-white/80">
                <li>
                  <a href="/about" className="hover:text-accent transition-colors">
                    About
                  </a>
                </li>
                <li>
                  <a href="/legal" className="hover:text-accent transition-colors">
                    Legal
                  </a>
                </li>
                <li>
                  <a href="/contact" className="hover:text-accent transition-colors">
                    Contact
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Connect</h4>
              <ul className="space-y-2 text-white/80">
                <li>
                  <a href="https://instagram.com/venturo_au" target="_blank" rel="noreferrer noopener" className="hover:text-accent transition-colors">
                    Instagram
                  </a>
                </li>
                <li>
                  <a href="mailto:hello@joinventuro.com" className="hover:text-accent transition-colors">
                    hello@joinventuro.com
                  </a>
                </li>
                <li>
                  <a href="mailto:support@joinventuro.com" className="hover:text-accent transition-colors">
                    support@joinventuro.com
                  </a>
                </li>
                <li>
                  <a href="mailto:team@joinventuro.com" className="hover:text-accent transition-colors">
                    team@joinventuro.com
                  </a>
                </li>
                <li>
                  <a 
                    href="mailto:hello@joinventuro.com?subject=Venturo%20Feedback&body=Hi%20Venturo%20team,%0D%0A%0D%0AI%20wanted%20to%20share%20my%20feedback%20about%20the%20platform:%0D%0A%0D%0A[Your%20feedback%20here]%0D%0A%0D%0ABest%20regards,%0D%0A[Your%20name]" 
                    className="hover:text-accent transition-colors"
                  >
                    Share Feedback
                  </a>
                </li>
              </ul>
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


