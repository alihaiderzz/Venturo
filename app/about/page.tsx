import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft, Users, Target, Shield, TrendingUp, MapPin, Heart } from "lucide-react"
import Link from "next/link"
import { LegalNotice } from "@/components/LegalNotice"

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center space-x-4">
            <Button variant="ghost" size="sm" asChild>
              <Link href="/" aria-label="Back to home">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back
              </Link>
            </Button>
            <h1 className="text-xl font-semibold">About Venturo</h1>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl lg:text-5xl font-bold mb-6">About Venturo</h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            Australia's premier platform for young founders to showcase ideas, connect with collaborators, 
            and build the next generation of successful startups.
          </p>
        </div>

        {/* Mission Section */}
        <div className="grid gap-8 lg:grid-cols-2 mb-16">
          <div>
            <h2 className="text-3xl font-bold mb-6">Our Mission</h2>
            <p className="text-lg text-muted-foreground mb-6 leading-relaxed">
              Venturo exists to make starting up easier, safer, and more connected for young Australian entrepreneurs. 
              We believe that great ideas deserve great teams, and that collaboration is the key to building 
              successful ventures.
            </p>
            <p className="text-lg text-muted-foreground leading-relaxed">
              Our platform bridges the gap between brilliant ideas and the right people to bring them to life. 
              Whether you're a founder looking for co-founders, an investor seeking opportunities, or a mentor 
              wanting to give back, Venturo connects you with the right people at the right time.
            </p>
          </div>
          <div className="flex items-center justify-center">
            <div className="w-64 h-64 bg-gradient-to-br from-[#21C087] to-[#1BA876] rounded-full flex items-center justify-center">
              <Target className="h-24 w-24 text-white" />
            </div>
          </div>
        </div>

        {/* What We Do */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-center mb-12">What We Do</h2>
          <div className="grid gap-6 md:grid-cols-3">
            <Card>
              <CardHeader>
                <div className="w-12 h-12 bg-[#21C087] rounded-lg flex items-center justify-center mb-4">
                  <Users className="h-6 w-6 text-white" />
                </div>
                <CardTitle>Connect Founders</CardTitle>
                <CardDescription>
                  Help founders find co-founders, team members, and collaborators who share their vision and complement their skills.
                </CardDescription>
              </CardHeader>
            </Card>
            <Card>
              <CardHeader>
                <div className="w-12 h-12 bg-[#21C087] rounded-lg flex items-center justify-center mb-4">
                  <TrendingUp className="h-6 w-6 text-white" />
                </div>
                <CardTitle>Showcase Ideas</CardTitle>
                <CardDescription>
                  Provide a platform for founders to showcase their ideas and get feedback from the community.
                </CardDescription>
              </CardHeader>
            </Card>
            <Card>
              <CardHeader>
                <div className="w-12 h-12 bg-[#21C087] rounded-lg flex items-center justify-center mb-4">
                  <Shield className="h-6 w-6 text-white" />
                </div>
                <CardTitle>Safe Networking</CardTitle>
                <CardDescription>
                  Create a safe, professional environment for networking and collaboration with proper legal safeguards.
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>

        {/* Why Venturo */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-center mb-12">Why Choose Venturo?</h2>
          <div className="grid gap-8 lg:grid-cols-2">
            <div className="space-y-6">
              <div className="flex items-start space-x-4">
                <div className="w-8 h-8 bg-[#21C087] rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                  <span className="text-white font-bold text-sm">1</span>
                </div>
                <div>
                  <h3 className="font-semibold mb-2">Focused on Australia</h3>
                  <p className="text-muted-foreground">
                    We understand the unique challenges and opportunities of the Australian startup ecosystem.
                  </p>
                </div>
              </div>
              <div className="flex items-start space-x-4">
                <div className="w-8 h-8 bg-[#21C087] rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                  <span className="text-white font-bold text-sm">2</span>
                </div>
                <div>
                  <h3 className="font-semibold mb-2">Quality Over Quantity</h3>
                  <p className="text-muted-foreground">
                    We focus on meaningful connections rather than just collecting contacts.
                  </p>
                </div>
              </div>
              <div className="flex items-start space-x-4">
                <div className="w-8 h-8 bg-[#21C087] rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                  <span className="text-white font-bold text-sm">3</span>
                </div>
                <div>
                  <h3 className="font-semibold mb-2">Legal Protection</h3>
                  <p className="text-muted-foreground">
                    Clear legal frameworks and disclaimers to protect all parties involved.
                  </p>
                </div>
              </div>
            </div>
            <div className="space-y-6">
              <div className="flex items-start space-x-4">
                <div className="w-8 h-8 bg-[#21C087] rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                  <span className="text-white font-bold text-sm">4</span>
                </div>
                <div>
                  <h3 className="font-semibold mb-2">Community-Driven</h3>
                  <p className="text-muted-foreground">
                    Built by founders, for founders, with continuous feedback and improvement.
                  </p>
                </div>
              </div>
              <div className="flex items-start space-x-4">
                <div className="w-8 h-8 bg-[#21C087] rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                  <span className="text-white font-bold text-sm">5</span>
                </div>
                <div>
                  <h3 className="font-semibold mb-2">Transparent Pricing</h3>
                  <p className="text-muted-foreground">
                    Clear, simple pricing with no hidden fees or complicated tiers.
                  </p>
                </div>
              </div>
              <div className="flex items-start space-x-4">
                <div className="w-8 h-8 bg-[#21C087] rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                  <span className="text-white font-bold text-sm">6</span>
                </div>
                <div>
                  <h3 className="font-semibold mb-2">Ongoing Support</h3>
                  <p className="text-muted-foreground">
                    Resources, events, and mentorship opportunities to help you succeed.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="mb-16">
          <div className="grid gap-6 md:grid-cols-4 text-center">
            <div>
              <div className="text-3xl font-bold text-[#21C087] mb-2">500+</div>
              <div className="text-muted-foreground">Active Founders</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-[#21C087] mb-2">200+</div>
              <div className="text-muted-foreground">Startup Ideas</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-[#21C087] mb-2">50+</div>
              <div className="text-muted-foreground">Successful Matches</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-[#21C087] mb-2">8</div>
              <div className="text-muted-foreground">Australian States</div>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold mb-4">Ready to Get Started?</h2>
          <p className="text-lg text-muted-foreground mb-6">
            Join hundreds of founders who are already building the future on Venturo.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg" className="bg-accent hover:bg-accent/90">
              <Link href="/create">Upload Your Idea</Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="border-primary text-primary hover:bg-primary hover:text-white">
              <Link href="/browse">Browse Ideas</Link>
            </Button>
          </div>
          <div className="mt-8">
            <p className="text-sm text-muted-foreground mb-2">Questions? Reach out to us on Instagram</p>
            <Button asChild variant="ghost" size="sm">
              <a href="https://instagram.com/venturo_au" target="_blank" rel="noreferrer noopener" className="text-accent hover:text-accent/80">
                @venturo_au
              </a>
            </Button>
          </div>
        </div>

        <div className="mt-8">
          <LegalNotice />
        </div>
      </main>
    </div>
  )
}

