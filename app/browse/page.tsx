"use client"
import React, { useState, useMemo, useEffect } from "react"
import { LegalNotice } from "@/components/LegalNotice"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Heart, UserPlus, ArrowLeft, Search, Filter, X } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import Link from "next/link"
import { ShareButton } from "@/components/ShareButton"

export default function BrowsePage() {
  const { toast } = useToast()
  const [ideas, setIdeas] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [selectedStage, setSelectedStage] = useState("all")
  const [selectedState, setSelectedState] = useState("all")
  const [selectedNeeds, setSelectedNeeds] = useState("all")
  const [sortBy, setSortBy] = useState("newest")
  const [searchFocused, setSearchFocused] = useState(false)
  const [showAllIdeas, setShowAllIdeas] = useState(true)

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ctrl/Cmd + K to focus search
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault()
        const searchInput = document.querySelector('input[placeholder*="Search"]') as HTMLInputElement
        if (searchInput) {
          searchInput.focus()
        }
      }
      // Escape to clear search
      if (e.key === 'Escape' && searchTerm) {
        setSearchTerm("")
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [searchTerm])

  const categories = ["Technology", "Sustainability", "Healthcare", "Education", "Finance", "Retail", "Manufacturing", "Other"]
  const stages = ["Idea", "MVP", "Early Revenue", "Growth", "Established"]
  const states = ["NSW", "VIC", "QLD", "WA", "SA", "TAS", "ACT", "NT"]
  const needsOptions = ["Capital", "Co-founder", "Skills", "Mentorship"]

  // Fetch ideas from Supabase
  useEffect(() => {
    const fetchIdeas = async () => {
      try {
        setLoading(true)
        setError("")
        const res = await fetch("/api/get-ideas")
        const data = await res.json()
        
        if (res.ok) {
          const fetchedIdeas = data.data || []
          setIdeas(fetchedIdeas)
        } else {
          const errorMsg = data.error || "Failed to fetch ideas"
          setError(errorMsg)
          console.error("Failed to fetch ideas:", data.error)
        }
      } catch (error) {
        const errorMsg = "Network error. Please try again."
        setError(errorMsg)
        console.error("Error fetching ideas:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchIdeas()
  }, [])

  const filteredIdeas = useMemo(() => {
    let filtered = ideas || []

    // Enhanced search filter - search across multiple fields
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase()
      filtered = filtered.filter(idea => 
        idea.title?.toLowerCase().includes(searchLower) ||
        idea.description?.toLowerCase().includes(searchLower) ||
        idea.one_liner?.toLowerCase().includes(searchLower) ||
        idea.category?.toLowerCase().includes(searchLower) ||
        idea.owner?.full_name?.toLowerCase().includes(searchLower)
      )
    }

    // Category filter
    if (selectedCategory !== "all") {
      filtered = filtered.filter(idea => idea.category === selectedCategory)
    }

    // Stage filter
    if (selectedStage !== "all") {
      filtered = filtered.filter(idea => idea.stage === selectedStage)
    }

    // Location filter
    if (selectedState !== "all") {
      filtered = filtered.filter(idea => idea.location === selectedState)
    }

    // Needs filter
    if (selectedNeeds !== "all") {
      filtered = filtered.filter(idea => {
        switch (selectedNeeds) {
          case "Capital":
            return idea.needs_capital
          case "Co-founder":
            return idea.needs_cofounder
          case "Skills":
            return idea.needs_skills
          case "Mentorship":
            return idea.needs_mentorship
          default:
            return true
        }
      })
    }

    // Sort with priority for boosted ideas
    switch (sortBy) {
      case "newest":
        // Boosted ideas first, then by newest
        filtered = filtered.sort((a, b) => {
          const aBoosted = a.boostedUntil && new Date(a.boostedUntil) > new Date()
          const bBoosted = b.boostedUntil && new Date(b.boostedUntil) > new Date()
          
          if (aBoosted && !bBoosted) return -1
          if (!aBoosted && bBoosted) return 1
          
          return new Date(b.created_at || 0).getTime() - new Date(a.created_at || 0).getTime()
        })
        break
      case "trending":
        // Boosted ideas first, then by views
        filtered = filtered.sort((a, b) => {
          const aBoosted = a.boostedUntil && new Date(a.boostedUntil) > new Date()
          const bBoosted = b.boostedUntil && new Date(b.boostedUntil) > new Date()
          
          if (aBoosted && !bBoosted) return -1
          if (!aBoosted && bBoosted) return 1
          
          return (b.stats?.views || 0) - (a.stats?.views || 0)
        })
        break
      case "most-saved":
        // Boosted ideas first, then by saves
        filtered = filtered.sort((a, b) => {
          const aBoosted = a.boostedUntil && new Date(a.boostedUntil) > new Date()
          const bBoosted = b.boostedUntil && new Date(b.boostedUntil) > new Date()
          
          if (aBoosted && !bBoosted) return -1
          if (!aBoosted && bBoosted) return 1
          
          return (b.stats?.saves || 0) - (a.stats?.saves || 0)
        })
        break
      case "alphabetical":
        // Boosted ideas first, then alphabetical
        filtered = filtered.sort((a, b) => {
          const aBoosted = a.boostedUntil && new Date(a.boostedUntil) > new Date()
          const bBoosted = b.boostedUntil && new Date(b.boostedUntil) > new Date()
          
          if (aBoosted && !bBoosted) return -1
          if (!aBoosted && bBoosted) return 1
          
          return a.title?.localeCompare(b.title || "") || 0
        })
        break
    }

    return filtered
  }, [searchTerm, selectedCategory, selectedStage, selectedState, selectedNeeds, sortBy, ideas])

  const clearFilters = () => {
    setSearchTerm("")
    setSelectedCategory("all")
    setSelectedStage("all")
    setSelectedState("all")
    setSelectedNeeds("all")
    console.log("Filters cleared")
  }

  const hasActiveFilters = searchTerm || selectedCategory !== "all" || selectedStage !== "all" || selectedState !== "all" || selectedNeeds !== "all"

  return (
    <main className="container mx-auto px-4 py-6 sm:py-8">
      <div className="mb-4 sm:mb-6">
        <LegalNotice />
      </div>
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center space-y-4 sm:space-y-0 sm:space-x-4 mb-6">
        <Button variant="ghost" size="sm" asChild className="self-start">
          <Link href="/" aria-label="Back to home">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Link>
        </Button>
        <div className="flex-1">
          <h1 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Browse Ideas
          </h1>
          <p className="text-muted-foreground text-sm sm:text-base mt-1">
            Discover innovative ideas from Australia's entrepreneurial community
          </p>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="mb-6 sm:mb-8 space-y-4">
        {/* Enhanced Search Bar */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input 
            placeholder="Search ideas... (⌘K)"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onFocus={() => setSearchFocused(true)}
            onBlur={() => setSearchFocused(false)}
            className={`pl-10 transition-all duration-200 ${
              searchFocused ? 'ring-2 ring-[#21C087] border-[#21C087]' : ''
            }`}
            aria-label="Search ideas"
          />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm("")}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground hover:text-foreground"
              aria-label="Clear search"
              title="Clear search (Esc)"
            >
              <X className="h-4 w-4" />
            </button>
          )}
          <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-xs text-muted-foreground hidden sm:block">
            ⌘K
          </div>
        </div>

        {/* Filters */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 sm:gap-4">
          <Select value={selectedCategory} onValueChange={setSelectedCategory}>
            <SelectTrigger>
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              {categories.map((category) => (
                <SelectItem key={category} value={category}>{category}</SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={selectedStage} onValueChange={setSelectedStage}>
            <SelectTrigger>
              <SelectValue placeholder="Stage" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Stages</SelectItem>
              {stages.map((stage) => (
                <SelectItem key={stage} value={stage}>{stage}</SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={selectedState} onValueChange={setSelectedState}>
            <SelectTrigger>
              <SelectValue placeholder="Location" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Locations</SelectItem>
              {states.map((state) => (
                <SelectItem key={state} value={state}>{state}</SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={selectedNeeds} onValueChange={setSelectedNeeds}>
            <SelectTrigger>
              <SelectValue placeholder="Needs" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Needs</SelectItem>
              {needsOptions.map((need) => (
                <SelectItem key={need} value={need}>{need}</SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="newest">Newest First</SelectItem>
              <SelectItem value="alphabetical">A-Z</SelectItem>
              <SelectItem value="trending">Trending</SelectItem>
              <SelectItem value="most-saved">Most Saved</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Active Filters */}
        {hasActiveFilters && (
          <div className="flex items-center space-x-2">
            <span className="text-sm text-muted-foreground">Active filters:</span>
            {searchTerm && (
              <Badge variant="secondary" className="flex items-center space-x-1">
                <span>Search: {searchTerm}</span>
                <X className="h-3 w-3 cursor-pointer" onClick={() => setSearchTerm("")} />
              </Badge>
            )}
            {selectedCategory !== "all" && (
              <Badge variant="secondary" className="flex items-center space-x-1">
                <span>Category: {selectedCategory}</span>
                <X className="h-3 w-3 cursor-pointer" onClick={() => setSelectedCategory("all")} />
              </Badge>
            )}
            {selectedStage !== "all" && (
              <Badge variant="secondary" className="flex items-center space-x-1">
                <span>Stage: {selectedStage}</span>
                <X className="h-3 w-3 cursor-pointer" onClick={() => setSelectedStage("all")} />
              </Badge>
            )}
            {selectedState !== "all" && (
              <Badge variant="secondary" className="flex items-center space-x-1">
                <span>Location: {selectedState}</span>
                <X className="h-3 w-3 cursor-pointer" onClick={() => setSelectedState("all")} />
              </Badge>
            )}
            {selectedNeeds !== "all" && (
              <Badge variant="secondary" className="flex items-center space-x-1">
                <span>Needs: {selectedNeeds}</span>
                <X className="h-3 w-3 cursor-pointer" onClick={() => setSelectedNeeds("all")} />
              </Badge>
            )}
            <Button variant="ghost" size="sm" onClick={clearFilters}>
              Clear All
            </Button>
          </div>
        )}

        {/* Results Summary */}
        <div className="flex items-center justify-between">
          <div className="text-sm text-muted-foreground">
            {searchTerm || hasActiveFilters ? (
              <span>
                Found {filteredIdeas.length} result{filteredIdeas.length !== 1 ? 's' : ''} 
                {searchTerm && ` for "${searchTerm}"`}
                {filteredIdeas.length !== ideas.length && (
                  <span className="ml-1">(of {ideas.length} total)</span>
                )}
              </span>
            ) : (
              <span>Showing {filteredIdeas.length} of {ideas.length} ideas</span>
            )}
          </div>
          {hasActiveFilters && (
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={clearFilters}
              className="text-muted-foreground hover:text-foreground"
            >
              <X className="h-3 w-3 mr-1" />
              Clear filters
            </Button>
          )}
        </div>
      </div>

      {/* Error State */}
      {error && (
        <div className="text-center py-12">
          <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-md mx-auto">
            <div className="text-red-600 mb-4">
              <X className="h-8 w-8 mx-auto mb-2" />
              <h3 className="text-lg font-medium">Error Loading Ideas</h3>
            </div>
            <p className="text-red-600 text-sm mb-4">{error}</p>
            <Button 
              onClick={() => window.location.reload()} 
              variant="outline"
              className="border-red-300 text-red-600 hover:bg-red-50"
            >
              Try Again
            </Button>
          </div>
        </div>
      )}

      {/* Ideas Grid */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {[...Array(6)].map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardHeader>
                <div className="h-6 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-full mb-1"></div>
                <div className="h-4 bg-gray-200 rounded w-2/3"></div>
              </CardHeader>
              <CardContent>
                <div className="h-4 bg-gray-200 rounded w-1/2 mb-3"></div>
                <div className="h-8 bg-gray-200 rounded w-1/4 mb-4"></div>
                <div className="flex gap-2">
                  <div className="h-10 bg-gray-200 rounded flex-1"></div>
                  <div className="h-10 bg-gray-200 rounded w-10"></div>
                  <div className="h-10 bg-gray-200 rounded w-10"></div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : !error && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {filteredIdeas.map((idea) => (
            <Card key={idea.id} className="hover:shadow-lg transition-all duration-200 hover:scale-[1.02]">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-start justify-between gap-2">
                  <span className="text-base sm:text-lg leading-tight">{idea.title}</span>
                  {idea.boostedUntil && (
                    <Badge className="bg-[#F5B800] text-black text-xs flex-shrink-0">Boosted</Badge>
                  )}
                </CardTitle>
                <CardDescription className="line-clamp-2 text-sm">{idea.one_liner}</CardDescription>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="text-xs sm:text-sm text-muted-foreground mb-3">
                  {idea.category} • {idea.owner?.full_name || 'Anonymous'}
                </div>
                <div className="flex flex-wrap gap-2 mb-4">
                  <Badge variant="outline" className="text-xs">
                    {idea.category}
                  </Badge>
                  {idea.stage && (
                    <Badge variant="outline" className="text-xs">
                      {idea.stage}
                    </Badge>
                  )}
                </div>
                <ActionRow 
                  ideaId={idea.id} 
                  created_by={idea.owner?.full_name || 'Anonymous'}
                  ideaTitle={idea.title}
                  ideaDescription={idea.one_liner}
                />
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* No Results */}
      {filteredIdeas.length === 0 && !loading && !error && (
        <div className="text-center py-12">
          <div className="text-muted-foreground mb-4">
            <Search className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <h3 className="text-lg font-medium mb-2">
              {searchTerm || hasActiveFilters ? "No ideas found" : "No ideas yet"}
            </h3>
            <p className="text-sm">
              {searchTerm || hasActiveFilters 
                ? "Try adjusting your search or filters" 
                : "Be the first to share your startup idea!"
              }
            </p>
          </div>
          {(searchTerm || hasActiveFilters) && (
            <Button variant="outline" onClick={clearFilters} className="mr-2">
              Clear All Filters
            </Button>
          )}
          <Button asChild>
            <Link href="/create">Upload Your Idea</Link>
          </Button>
        </div>
      )}
    </main>
  )
}

// ActionRow component moved outside to fix build issues
const ActionRow = ({ ideaId, created_by, ideaTitle, ideaDescription }: { 
  ideaId: string; 
  created_by: string;
  ideaTitle: string;
  ideaDescription?: string;
}) => {
  return (
    <div className="flex items-center gap-2">
      <Button asChild className="h-11 min-h-11 flex-1">
        <Link href={`/idea/${ideaId}`} aria-label={`View idea ${ideaId}`}>
          View
        </Link>
      </Button>
      <ShareButton 
        ideaId={ideaId}
        ideaTitle={ideaTitle}
        ideaDescription={ideaDescription}
      />
    </div>
  )
}

