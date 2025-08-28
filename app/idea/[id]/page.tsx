import { notFound } from "next/navigation"
import { supabase } from "@/lib/supabaseClient"
import { LegalNotice } from "@/components/LegalNotice"
import { Button } from "@/components/ui/button"
import { ArrowLeft, UserPlus, Share2, Mail, Phone, Globe, Linkedin, Twitter, Rocket, TrendingUp, Users, Target, Calendar, MapPin, Building, Star, CheckCircle, ArrowRight } from "lucide-react"
import Link from "next/link"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ShareButtonWrapper } from "@/components/ShareButtonWrapper"

export default async function IdeaDetail({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  
  // Fetch idea from Supabase
  const { data: idea, error } = await supabase()
    .from("startup_ideas")
    .select(`
      *,
      owner:user_profiles!startup_ideas_owner_id_fkey(
        id,
        full_name,
        role,
        location,
        company,
        email
      )
    `)
    .eq('id', id)
    .eq('status', 'active')
    .single()

  if (error || !idea) {
    console.error("Error fetching idea:", error)
    return notFound()
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <div className="container mx-auto px-4 py-6">
        <div className="mb-4">
          <LegalNotice />
        </div>
        
        {/* Hero Section */}
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-blue-600 to-purple-700 text-white p-8 mb-8">
          <div className="absolute inset-0 bg-black/10"></div>
          <div className="relative z-10">
            <div className="flex items-center space-x-4 mb-6">
              <Button variant="ghost" size="sm" asChild className="text-white hover:bg-white/20">
                <Link href="/browse" aria-label="Back to browse">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Ideas
                </Link>
              </Button>
              {idea.is_boosted && (
                <Badge className="bg-[#F5B800] text-black font-semibold">
                  <Star className="h-3 w-3 mr-1" />
                  Featured
                </Badge>
              )}
            </div>
            
            <div className="max-w-4xl">
              <h1 className="text-5xl font-bold mb-4">{idea.title}</h1>
              <p className="text-xl text-blue-100 mb-6">{idea.one_liner}</p>
              
              <div className="flex flex-wrap gap-3 mb-6">
                <Badge variant="secondary" className="bg-white/20 text-white border-white/30">
                  <Rocket className="h-3 w-3 mr-1" />
                  {idea.category}
                </Badge>
                {idea.stage && (
                  <Badge variant="secondary" className="bg-white/20 text-white border-white/30">
                    <TrendingUp className="h-3 w-3 mr-1" />
                    {idea.stage}
                  </Badge>
                )}
                {idea.location && (
                  <Badge variant="secondary" className="bg-white/20 text-white border-white/30">
                    <MapPin className="h-3 w-3 mr-1" />
                    {idea.location}
                  </Badge>
                )}
              </div>
              
              <div className="flex items-center text-blue-100">
                <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center mr-3">
                  <Users className="h-5 w-5" />
                </div>
                <div>
                  <div className="font-medium">Created by {idea.owner?.full_name || 'Anonymous'}</div>
                  <div className="text-sm opacity-80">{idea.location || 'Unknown location'}</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            {/* Problem & Solution */}
            {(idea.problem || idea.solution) && (
              <div className="grid md:grid-cols-2 gap-6">
                {idea.problem && (
                  <Card className="border-l-4 border-l-red-500">
                    <CardHeader>
                      <CardTitle className="flex items-center text-red-700">
                        <Target className="h-5 w-5 mr-2" />
                        The Problem
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="whitespace-pre-wrap text-gray-700 leading-relaxed">{idea.problem}</p>
                    </CardContent>
                  </Card>
                )}
                
                {idea.solution && (
                  <Card className="border-l-4 border-l-green-500">
                    <CardHeader>
                      <CardTitle className="flex items-center text-green-700">
                        <CheckCircle className="h-5 w-5 mr-2" />
                        Our Solution
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="whitespace-pre-wrap text-gray-700 leading-relaxed">{idea.solution}</p>
                    </CardContent>
                  </Card>
                )}
              </div>
            )}

            {/* Traction */}
            {idea.traction && (
              <Card className="bg-gradient-to-r from-green-50 to-emerald-50 border-green-200">
                <CardHeader>
                  <CardTitle className="flex items-center text-green-800">
                    <TrendingUp className="h-5 w-5 mr-2" />
                    Traction & Progress
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="whitespace-pre-wrap text-gray-700 leading-relaxed">{idea.traction}</p>
                </CardContent>
              </Card>
            )}

            {/* Investment Opportunity */}
            {(idea.needs_capital || idea.needs_cofounder || idea.needs_skills || idea.needs_mentorship) && (
              <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
                <CardHeader>
                  <CardTitle className="flex items-center text-blue-800">
                    <Rocket className="h-5 w-5 mr-2" />
                    Investment Opportunity
                  </CardTitle>
                  <p className="text-blue-600 text-sm">Join us in building the future</p>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-2 gap-4">
                    {idea.needs_capital && (
                      <div className="bg-white p-4 rounded-lg border border-blue-100">
                        <div className="flex items-center gap-3 mb-2">
                          <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                            <TrendingUp className="h-4 w-4 text-blue-600" />
                          </div>
                          <Badge variant="secondary" className="bg-blue-100 text-blue-800">Capital Investment</Badge>
                        </div>
                        <p className="text-sm text-gray-700">{idea.needs_capital}</p>
                      </div>
                    )}
                    {idea.needs_cofounder && (
                      <div className="bg-white p-4 rounded-lg border border-blue-100">
                        <div className="flex items-center gap-3 mb-2">
                          <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                            <Users className="h-4 w-4 text-blue-600" />
                          </div>
                          <Badge variant="secondary" className="bg-blue-100 text-blue-800">Co-founder</Badge>
                        </div>
                        <p className="text-sm text-gray-700">{idea.needs_cofounder}</p>
                      </div>
                    )}
                    {idea.needs_skills && (
                      <div className="bg-white p-4 rounded-lg border border-blue-100">
                        <div className="flex items-center gap-3 mb-2">
                          <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                            <Target className="h-4 w-4 text-blue-600" />
                          </div>
                          <Badge variant="secondary" className="bg-blue-100 text-blue-800">Skills</Badge>
                        </div>
                        <p className="text-sm text-gray-700">{idea.needs_skills}</p>
                      </div>
                    )}
                    {idea.needs_mentorship && (
                      <div className="bg-white p-4 rounded-lg border border-blue-100">
                        <div className="flex items-center gap-3 mb-2">
                          <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                            <Star className="h-4 w-4 text-blue-600" />
                          </div>
                          <Badge variant="secondary" className="bg-blue-100 text-blue-800">Mentorship</Badge>
                        </div>
                        <p className="text-sm text-gray-700">{idea.needs_mentorship}</p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Links */}
            {(idea.website_url || idea.pitch_deck_url) && (
              <Card>
                <CardHeader>
                  <CardTitle>Resources</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex gap-2">
                    {idea.website_url && (
                      <Button asChild variant="outline">
                        <a href={idea.website_url} target="_blank" rel="noopener noreferrer">
                          <Globe className="h-4 w-4 mr-2" />
                          Website
                        </a>
                      </Button>
                    )}
                    {idea.pitch_deck_url && (
                      <Button asChild variant="outline">
                        <a href={idea.pitch_deck_url} target="_blank" rel="noopener noreferrer">
                          Pitch Deck
                        </a>
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Sidebar */}
          <aside className="space-y-6">
            {/* Founder Profile */}
            <Card className="bg-gradient-to-br from-slate-50 to-gray-50 border-gray-200">
              <CardHeader>
                <CardTitle className="flex items-center text-gray-800">
                  <Building className="h-5 w-5 mr-2" />
                  Meet the Founder
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center mb-4">
                  <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-3">
                    <Users className="h-8 w-8 text-white" />
                  </div>
                  <div className="font-semibold text-lg">{idea.owner?.full_name || 'Anonymous'}</div>
                  {idea.owner?.role && (
                    <div className="text-sm text-gray-600 capitalize">{idea.owner.role}</div>
                  )}
                </div>
                <div className="space-y-2 text-sm">
                  {idea.owner?.location && (
                    <div className="flex items-center text-gray-600">
                      <MapPin className="h-4 w-4 mr-2" />
                      {idea.owner.location}
                    </div>
                  )}
                  {idea.owner?.company && (
                    <div className="flex items-center text-gray-600">
                      <Building className="h-4 w-4 mr-2" />
                      {idea.owner.company}
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Quick Overview */}
            <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200">
              <CardHeader>
                <CardTitle className="flex items-center text-blue-800">
                  <Target className="h-5 w-5 mr-2" />
                  Quick Overview
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-700 leading-relaxed mb-4">{idea.one_liner}</p>
                <div className="bg-white p-3 rounded-lg border border-blue-100">
                  <div className="text-xs text-blue-600 font-medium mb-1">Current Stage</div>
                  <div className="text-sm font-semibold text-gray-800">{idea.stage || 'Idea Stage'}</div>
                </div>
              </CardContent>
            </Card>

            {/* Key Questions */}
            <Card className="bg-gradient-to-br from-amber-50 to-orange-50 border-amber-200">
              <CardHeader>
                <CardTitle className="flex items-center text-amber-800">
                  <Star className="h-5 w-5 mr-2" />
                  Key Questions
                </CardTitle>
                <p className="text-amber-700 text-sm">Essential due diligence points</p>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  <li className="flex items-start">
                    <div className="w-2 h-2 bg-amber-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                    <span className="text-sm text-gray-700">What traction validates {idea.title} today?</span>
                  </li>
                  <li className="flex items-start">
                    <div className="w-2 h-2 bg-amber-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                    <span className="text-sm text-gray-700">How will you acquire your first 100 users?</span>
                  </li>
                  <li className="flex items-start">
                    <div className="w-2 h-2 bg-amber-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                    <span className="text-sm text-gray-700">What milestones unlock your next stage from {idea.stage || 'current stage'}?</span>
                  </li>
                  <li className="flex items-start">
                    <div className="w-2 h-2 bg-amber-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                    <span className="text-sm text-gray-700">What's your competitive advantage in the market?</span>
                  </li>
                </ul>
              </CardContent>
            </Card>

            {/* Call to Action */}
            <Card className="bg-gradient-to-br from-green-50 to-emerald-50 border-green-200">
              <CardHeader>
                <CardTitle className="flex items-center text-green-800">
                  <ArrowRight className="h-5 w-5 mr-2" />
                  Get Involved
                </CardTitle>
                <p className="text-green-700 text-sm">Ready to join this journey?</p>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-end">
                    <ShareButtonWrapper 
                      ideaId={idea.id} 
                      ideaTitle={idea.title} 
                      ideaDescription={idea.one_liner}
                    />
                  </div>
                  <ContactFounderButton 
                    founder={idea.owner} 
                    ideaTitle={idea.title}
                  />
                </div>
              </CardContent>
            </Card>
          </aside>
        </div>
      </div>
    </main>
  )
}

// Contact Founder Button Component
function ContactFounderButton({ founder, ideaTitle }: { founder: any, ideaTitle: string }) {
  const hasContactInfo = founder?.email || founder?.phone || founder?.website_url || founder?.linkedin_url || founder?.twitter_url

  if (!hasContactInfo) {
    return (
      <Button variant="outline" className="w-full h-12 bg-white hover:bg-gray-50 border-green-300 text-green-700" disabled>
        <UserPlus className="h-4 w-4 mr-2" />
        Contact Founder
      </Button>
    )
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button className="w-full h-12 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-200">
          <UserPlus className="h-4 w-4 mr-2" />
          Contact Founder
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        {founder?.email && (
          <DropdownMenuItem asChild>
            <a href={`mailto:${founder.email}?subject=Interested in ${ideaTitle}`} className="cursor-pointer">
              <Mail className="h-4 w-4 mr-2" />
              Email
            </a>
          </DropdownMenuItem>
        )}
        {founder?.phone && (
          <DropdownMenuItem asChild>
            <a href={`tel:${founder.phone}`} className="cursor-pointer">
              <Phone className="h-4 w-4 mr-2" />
              Call
            </a>
          </DropdownMenuItem>
        )}
        {founder?.website_url && (
          <DropdownMenuItem asChild>
            <a href={founder.website_url} target="_blank" rel="noopener noreferrer" className="cursor-pointer">
              <Globe className="h-4 w-4 mr-2" />
              Website
            </a>
          </DropdownMenuItem>
        )}
        {founder?.linkedin_url && (
          <DropdownMenuItem asChild>
            <a href={founder.linkedin_url} target="_blank" rel="noopener noreferrer" className="cursor-pointer">
              <Linkedin className="h-4 w-4 mr-2" />
              LinkedIn
            </a>
          </DropdownMenuItem>
        )}
        {founder?.twitter_url && (
          <DropdownMenuItem asChild>
            <a href={founder.twitter_url} target="_blank" rel="noopener noreferrer" className="cursor-pointer">
              <Twitter className="h-4 w-4 mr-2" />
              Twitter
            </a>
          </DropdownMenuItem>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

