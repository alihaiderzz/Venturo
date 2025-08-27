import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft, Plus, MessageSquare, Heart, Eye, TrendingUp, Settings, User, Bookmark, Upload } from "lucide-react"
import Link from "next/link"
import { LegalNotice } from "@/components/LegalNotice"
import { db } from "@/lib/store"
import { SignedIn, SignedOut, RedirectToSignIn } from "@clerk/nextjs"

export default function DashboardPage() {
  return (
    <>
      <SignedOut>
        <RedirectToSignIn />
      </SignedOut>
      <SignedIn>
        <div className="min-h-screen bg-background">
          {/* Header with back button */}
          <header className="bg-white border-b border-gray-200 shadow-sm">
            <div className="container mx-auto px-4 py-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <Button variant="ghost" size="sm" asChild>
                    <Link href="/" aria-label="Back to home">
                      <ArrowLeft className="h-4 w-4 mr-2" />
                      Back
                    </Link>
                  </Button>
                  <h1 className="text-xl font-semibold">Dashboard</h1>
                </div>
                <div className="flex items-center space-x-2">
                  <Button variant="ghost" size="sm" asChild>
                    <Link href="/profile" aria-label="Edit profile">
                      <Settings className="h-4 w-4 mr-2" />
                      Profile
                    </Link>
                  </Button>
                </div>
              </div>
            </div>
          </header>

          <main className="container mx-auto px-4 py-8">
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {/* Quick Actions */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Plus className="h-5 w-5 mr-2" />
                    Quick Actions
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Button asChild className="w-full">
                    <Link href="/create">Create New Listing</Link>
                  </Button>
                  <Button asChild variant="outline" className="w-full">
                    <Link href="/browse">Browse Ideas</Link>
                  </Button>
                  <Button asChild variant="outline" className="w-full">
                    <Link href="/matches">View Matches</Link>
                  </Button>
                </CardContent>
              </Card>

              {/* My Submissions */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Upload className="h-5 w-5 mr-2" />
                    My Submissions
                  </CardTitle>
                  <CardDescription>Your startup ideas and listings</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {db.ideas.filter(i => i.ownerId === "u1").map((idea) => (
                    <div key={idea.id} className="p-3 border rounded-lg">
                      <div className="font-semibold text-sm">{idea.title}</div>
                      <div className="text-xs text-muted-foreground">{idea.category} • {idea.stage}</div>
                      <div className="flex items-center space-x-2 mt-2">
                        <span className="text-xs text-muted-foreground flex items-center">
                          <Eye className="h-3 w-3 mr-1" />
                          {idea.stats?.views || 0}
                        </span>
                        <span className="text-xs text-muted-foreground flex items-center">
                          <Heart className="h-3 w-3 mr-1" />
                          {idea.stats?.saves || 0}
                        </span>
                      </div>
                    </div>
                  ))}
                  {db.ideas.filter(i => i.ownerId === "u1").length === 0 && (
                    <div className="text-center py-4 text-muted-foreground">
                      <p className="text-sm">No submissions yet</p>
                      <Button asChild size="sm" className="mt-2">
                        <Link href="/create">Create your first listing</Link>
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Saved Startups */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Bookmark className="h-5 w-5 mr-2" />
                    Saved Startups
                  </CardTitle>
                  <CardDescription>Ideas you've bookmarked</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {db.ideas.slice(0, 3).map((idea) => (
                    <div key={idea.id} className="p-3 border rounded-lg">
                      <div className="font-semibold text-sm">{idea.title}</div>
                      <div className="text-xs text-muted-foreground">{idea.category} • {idea.stage}</div>
                      <Button asChild size="sm" variant="ghost" className="mt-2 w-full">
                        <Link href={`/idea/${idea.id}`}>View Details</Link>
                      </Button>
                    </div>
                  ))}
                  <Button asChild variant="outline" size="sm" className="w-full">
                    <Link href="/saved">View All Saved</Link>
                  </Button>
                </CardContent>
              </Card>

              {/* Stats */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <TrendingUp className="h-5 w-5 mr-2" />
                    Your Stats
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Listings</span>
                    <span className="font-semibold">{db.ideas.filter(i => i.ownerId === "u1").length}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Profile Views</span>
                    <span className="font-semibold">127</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Messages</span>
                    <span className="font-semibold">8</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Matches</span>
                    <span className="font-semibold">12</span>
                  </div>
                </CardContent>
              </Card>

              {/* Recent Activity */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <MessageSquare className="h-5 w-5 mr-2" />
                    Recent Activity
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center space-x-3 text-sm">
                    <Eye className="h-4 w-4 text-muted-foreground" />
                    <span>Your listing "EcoTech" was viewed</span>
                  </div>
                  <div className="flex items-center space-x-3 text-sm">
                    <Heart className="h-4 w-4 text-muted-foreground" />
                    <span>New match with Sarah Chen</span>
                  </div>
                  <div className="flex items-center space-x-3 text-sm">
                    <MessageSquare className="h-4 w-4 text-muted-foreground" />
                    <span>Message from Marcus Williams</span>
                  </div>
                </CardContent>
              </Card>

              {/* Profile Summary */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <User className="h-5 w-5 mr-2" />
                    Profile Summary
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="text-sm">
                    <span className="font-semibold">Role:</span> Founder
                  </div>
                  <div className="text-sm">
                    <span className="font-semibold">Location:</span> NSW
                  </div>
                  <div className="text-sm">
                    <span className="font-semibold">Sectors:</span> Sustainability
                  </div>
                  <div className="text-sm">
                    <span className="font-semibold">Status:</span> 
                    <span className="ml-1 bg-[#F5B800] text-[#0B1E3C] px-2 py-0.5 rounded text-xs font-semibold">Pro</span>
                  </div>
                  <Button asChild size="sm" variant="outline" className="w-full mt-2">
                    <Link href="/profile">Edit Profile</Link>
                  </Button>
                </CardContent>
              </Card>
            </div>

            <div className="mt-8">
              <LegalNotice />
            </div>
          </main>
        </div>
      </SignedIn>
    </>
  )
}
