import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft, Instagram, Mail, MessageCircle, Clock, MapPin, Users, HelpCircle, Users2, Heart } from "lucide-react"
import Link from "next/link"
import { LegalNotice } from "@/components/LegalNotice"

export default function ContactPage() {
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
            <h1 className="text-xl font-semibold">Contact Us</h1>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl lg:text-5xl font-bold mb-6">Get in Touch</h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            Have questions about Venturo? We're here to help you connect, collaborate, and build the future.
          </p>
        </div>

        {/* Contact Methods */}
        <div className="grid gap-8 lg:grid-cols-2 mb-16">
          {/* Primary Contact */}
          <Card className="border-[#21C087]/20">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Instagram className="h-5 w-5 mr-2 text-[#21C087]" />
                Primary Contact
              </CardTitle>
              <CardDescription>
                Follow us on Instagram for the latest updates and direct messaging
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-center">
                <p className="text-lg font-semibold mb-2">@venturo_au</p>
                <p className="text-sm text-muted-foreground mb-4">
                  Our main channel for community updates, founder stories, and direct support
                </p>
                <Button asChild size="lg" className="bg-[#21C087] hover:bg-[#1a9f6f]">
                  <a href="https://instagram.com/venturo_au" target="_blank" rel="noreferrer noopener">
                    <Instagram className="h-4 w-4 mr-2" />
                    Follow on Instagram
                  </a>
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Email Contacts */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Mail className="h-5 w-5 mr-2 text-[#21C087]" />
                Email Contacts
              </CardTitle>
              <CardDescription>
                Reach out to us directly via email
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-4">
                <div className="p-4 border rounded-lg">
                  <div className="flex items-center mb-2">
                    <Heart className="h-4 w-4 mr-2 text-[#21C087]" />
                    <span className="font-semibold text-sm">General Inquiries</span>
                  </div>
                  <a href="mailto:hello@joinventuro.com" className="text-[#21C087] hover:underline text-sm">
                    hello@joinventuro.com
                  </a>
                  <p className="text-xs text-muted-foreground mt-1">
                    Questions about Venturo, partnerships, and general support
                  </p>
                </div>
                
                <div className="p-4 border rounded-lg">
                  <div className="flex items-center mb-2">
                    <HelpCircle className="h-4 w-4 mr-2 text-[#F5B800]" />
                    <span className="font-semibold text-sm">Technical Support</span>
                  </div>
                  <a href="mailto:support@joinventuro.com" className="text-[#21C087] hover:underline text-sm">
                    support@joinventuro.com
                  </a>
                  <p className="text-xs text-muted-foreground mt-1">
                    Platform issues, account problems, and technical assistance
                  </p>
                </div>
                
                <div className="p-4 border rounded-lg">
                  <div className="flex items-center mb-2">
                    <Users2 className="h-4 w-4 mr-2 text-[#0B1E3C]" />
                    <span className="font-semibold text-sm">Team & Partnerships</span>
                  </div>
                  <a href="mailto:team@joinventuro.com" className="text-[#21C087] hover:underline text-sm">
                    team@joinventuro.com
                  </a>
                  <p className="text-xs text-muted-foreground mt-1">
                    Business partnerships, team collaborations, and strategic inquiries
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Response Times */}
        <div className="mb-16">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Clock className="h-5 w-5 mr-2 text-[#21C087]" />
                Response Times
              </CardTitle>
              <CardDescription>
                When you can expect to hear back from us
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="text-center p-4 border rounded-lg">
                  <div className="text-2xl font-bold text-[#21C087] mb-2">24-48h</div>
                  <div className="text-sm font-medium">General Inquiries</div>
                  <div className="text-xs text-muted-foreground">hello@joinventuro.com</div>
                </div>
                <div className="text-center p-4 border rounded-lg">
                  <div className="text-2xl font-bold text-[#F5B800] mb-2">Same Day</div>
                  <div className="text-sm font-medium">Technical Support</div>
                  <div className="text-xs text-muted-foreground">support@joinventuro.com</div>
                </div>
                <div className="text-center p-4 border rounded-lg">
                  <div className="text-2xl font-bold text-[#0B1E3C] mb-2">2-3 Days</div>
                  <div className="text-sm font-medium">Partnership Requests</div>
                  <div className="text-xs text-muted-foreground">team@joinventuro.com</div>
                </div>
                <div className="text-center p-4 border rounded-lg">
                  <div className="text-2xl font-bold text-[#21C087] mb-2">Within Hours</div>
                  <div className="text-sm font-medium">Urgent Matters</div>
                  <div className="text-xs text-muted-foreground">Instagram DM</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* What We Can Help With */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-center mb-12">How Can We Help?</h2>
          <div className="grid gap-6 md:grid-cols-3">
            <Card>
              <CardHeader>
                <div className="w-12 h-12 bg-[#21C087] rounded-lg flex items-center justify-center mb-4">
                  <Users className="h-6 w-6 text-white" />
                </div>
                <CardTitle>Platform Support</CardTitle>
                <CardDescription>
                  Help with account setup, profile creation, and navigating the platform
                </CardDescription>
              </CardHeader>
              <CardContent>
                <a href="mailto:support@joinventuro.com" className="text-[#21C087] hover:underline text-sm">
                  support@joinventuro.com
                </a>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <div className="w-12 h-12 bg-[#F5B800] rounded-lg flex items-center justify-center mb-4">
                  <MessageCircle className="h-6 w-6 text-white" />
                </div>
                <CardTitle>Community Questions</CardTitle>
                <CardDescription>
                  Information about events, networking opportunities, and community guidelines
                </CardDescription>
              </CardHeader>
              <CardContent>
                <a href="mailto:hello@joinventuro.com" className="text-[#21C087] hover:underline text-sm">
                  hello@joinventuro.com
                </a>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <div className="w-12 h-12 bg-[#0B1E3C] rounded-lg flex items-center justify-center mb-4">
                  <Mail className="h-6 w-6 text-white" />
                </div>
                <CardTitle>Partnership Inquiries</CardTitle>
                <CardDescription>
                  Collaboration opportunities, sponsorships, and strategic partnerships
                </CardDescription>
              </CardHeader>
              <CardContent>
                <a href="mailto:team@joinventuro.com" className="text-[#21C087] hover:underline text-sm">
                  team@joinventuro.com
                </a>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-center mb-12">Frequently Asked Questions</h2>
          <div className="grid gap-6 lg:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">How do I create a startup listing?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Sign up for an account, then use our step-by-step form to create your listing. 
                  Include details about your idea, team needs, and what you're looking for.
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Is Venturo free to use?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  We offer a free tier with basic features. Premium plans provide additional 
                  benefits like priority exposure and advanced analytics.
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">How do I connect with other founders?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Browse startup listings, use our matching algorithm, and reach out through 
                  the social links provided by founders.
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">What makes Venturo different?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  We focus specifically on the Australian startup ecosystem, provide legal 
                  safeguards, and emphasize quality connections over quantity.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Location & Community */}
        <div className="mb-16">
          <div className="grid gap-8 lg:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <MapPin className="h-5 w-5 mr-2" />
                  Australian Focus
                </CardTitle>
                <CardDescription>
                  Built for the Australian startup ecosystem
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4">
                  Venturo is specifically designed for the Australian startup community. 
                  We understand the unique challenges and opportunities in the local ecosystem.
                </p>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Active States:</span>
                    <span className="font-medium">All 8 states & territories</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Community Size:</span>
                    <span className="font-medium">500+ founders</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Success Stories:</span>
                    <span className="font-medium">50+ connections made</span>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Users className="h-5 w-5 mr-2" />
                  Community Guidelines
                </CardTitle>
                <CardDescription>
                  How we maintain a professional environment
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 text-sm">
                  <div className="flex items-start space-x-2">
                    <div className="w-2 h-2 bg-[#21C087] rounded-full mt-2 flex-shrink-0"></div>
                    <span className="text-muted-foreground">Be professional and respectful in all interactions</span>
                  </div>
                  <div className="flex items-start space-x-2">
                    <div className="w-2 h-2 bg-[#21C087] rounded-full mt-2 flex-shrink-0"></div>
                    <span className="text-muted-foreground">Provide accurate and up-to-date information</span>
                  </div>
                  <div className="flex items-start space-x-2">
                    <div className="w-2 h-2 bg-[#21C087] rounded-full mt-2 flex-shrink-0"></div>
                    <span className="text-muted-foreground">Respect intellectual property and confidentiality</span>
                  </div>
                  <div className="flex items-start space-x-2">
                    <div className="w-2 h-2 bg-[#21C087] rounded-full mt-2 flex-shrink-0"></div>
                    <span className="text-muted-foreground">Report any suspicious or inappropriate behavior</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Final CTA */}
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold mb-4">Ready to Connect?</h2>
          <p className="text-lg text-muted-foreground mb-6">
            Join our community and start building meaningful connections today.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg" className="bg-[#21C087] hover:bg-[#1a9f6f]">
              <a href="https://instagram.com/venturo_au" target="_blank" rel="noreferrer noopener">
                <Instagram className="h-4 w-4 mr-2" />
                Follow @venturo_au
              </a>
            </Button>
            <Button asChild size="lg" variant="outline" className="border-[#0B1E3C] text-[#0B1E3C] hover:bg-[#0B1E3C] hover:text-white">
              <Link href="/browse">Browse Startups</Link>
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

