import { LegalNotice } from "@/components/LegalNotice"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Download, ExternalLink, FileText, Users, TrendingUp, BookOpen, Lightbulb, Target, MessageSquare } from "lucide-react"
import Link from "next/link"

const resources = {
  templates: [
    {
      id: 1,
      title: "Pitch Deck Template",
      description: "Professional pitch deck template with investor-ready slides and guidance.",
      category: "Pitch",
      format: "PowerPoint",
      downloads: 1247,
      icon: FileText
    },
    {
      id: 2,
      title: "Investor Outreach Script",
      description: "Email templates and scripts for reaching out to potential investors.",
      category: "Outreach",
      format: "PDF",
      downloads: 892,
      icon: MessageSquare
    },
    {
      id: 3,
      title: "Due Diligence Checklist",
      description: "Comprehensive checklist for investor due diligence preparation.",
      category: "Legal",
      format: "Excel",
      downloads: 567,
      icon: Target
    },
    {
      id: 4,
      title: "Co-founder Agreement",
      description: "Template for co-founder agreements and equity splits.",
      category: "Legal",
      format: "Word",
      downloads: 445,
      icon: Users
    }
  ],
  guides: [
    {
      id: 1,
      title: "Australian Startup Funding Guide",
      description: "Complete guide to funding options available to Australian startups.",
      category: "Funding",
      readTime: "15 min",
      icon: TrendingUp
    },
    {
      id: 2,
      title: "Customer Discovery Framework",
      description: "Step-by-step framework for validating your startup idea with customers.",
      category: "Validation",
      readTime: "20 min",
      icon: Lightbulb
    },
    {
      id: 3,
      title: "Team Building Best Practices",
      description: "How to build and scale your startup team effectively.",
      category: "Team",
      readTime: "12 min",
      icon: Users
    }
  ],
  tools: [
    {
      id: 1,
      title: "Venturo Startup Calculator",
      description: "Calculate runway, burn rate, and funding needs for your startup.",
      category: "Finance",
      link: "#",
      icon: TrendingUp
    },
    {
      id: 2,
      title: "Market Size Calculator",
      description: "Estimate your total addressable market (TAM) and serviceable market.",
      category: "Strategy",
      link: "#",
      icon: Target
    }
  ]
}

export default function ResourcesPage() {
  return (
    <main className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <LegalNotice />
      </div>
      
      {/* Header */}
      <div className="flex items-center space-x-4 mb-8">
        <Button variant="ghost" size="sm" asChild>
          <Link href="/" aria-label="Back to home">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Link>
        </Button>
        <div>
          <h1 className="text-3xl font-bold text-[#0B1E3C]">Resources</h1>
          <p className="text-muted-foreground mt-1">Tools, templates, and guides to help your startup succeed</p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <Card className="bg-gradient-to-r from-[#21C087] to-[#1a9f6f] text-white">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm opacity-90">Total Downloads</p>
                <p className="text-2xl font-bold">3,151</p>
              </div>
              <Download className="h-8 w-8 opacity-80" />
            </div>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-r from-[#F5B800] to-[#e6a800] text-white">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm opacity-90">Resources Available</p>
                <p className="text-2xl font-bold">9</p>
              </div>
              <BookOpen className="h-8 w-8 opacity-80" />
            </div>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-r from-[#0B1E3C] to-[#1a2d4f] text-white">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm opacity-90">Categories</p>
                <p className="text-2xl font-bold">6</p>
              </div>
              <FileText className="h-8 w-8 opacity-80" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Templates Section */}
      <section className="mb-12">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold text-[#0B1E3C]">Templates & Documents</h2>
            <p className="text-muted-foreground">Ready-to-use templates for common startup needs</p>
          </div>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {resources.templates.map((template) => (
            <Card key={template.id} className="hover:shadow-lg transition-all duration-200 border-0 shadow-md">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-lg text-[#0B1E3C] line-clamp-2">{template.title}</CardTitle>
                    <CardDescription className="mt-2">
                      <Badge 
                        variant="outline" 
                        className="text-xs border-[#21C087] text-[#21C087] hover:bg-[#21C087] hover:text-white"
                      >
                        {template.category}
                      </Badge>
                    </CardDescription>
                  </div>
                  <template.icon className="h-6 w-6 text-[#21C087] mt-1" />
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-muted-foreground line-clamp-3">
                  {template.description}
                </p>
                
                <div className="flex items-center justify-between text-sm text-muted-foreground">
                  <span className="bg-gray-100 px-2 py-1 rounded text-xs">{template.format}</span>
                  <span className="flex items-center">
                    <Download className="h-3 w-3 mr-1" />
                    {template.downloads}
                  </span>
                </div>

                <Button 
                  asChild 
                  className="w-full bg-[#21C087] hover:bg-[#1a9f6f] text-white"
                >
                  <a href="#" aria-label={`Download ${template.title}`}>
                    <Download className="h-4 w-4 mr-2" />
                    Download
                  </a>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Guides Section */}
      <section className="mb-12">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold text-[#0B1E3C]">Startup Guides</h2>
            <p className="text-muted-foreground">In-depth guides written by startup experts</p>
          </div>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {resources.guides.map((guide) => (
            <Card key={guide.id} className="hover:shadow-lg transition-all duration-200 border-0 shadow-md">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-lg text-[#0B1E3C] line-clamp-2">{guide.title}</CardTitle>
                    <CardDescription className="mt-2">
                      <Badge 
                        variant="outline" 
                        className="text-xs border-[#F5B800] text-[#F5B800] hover:bg-[#F5B800] hover:text-white"
                      >
                        {guide.category}
                      </Badge>
                    </CardDescription>
                  </div>
                  <guide.icon className="h-6 w-6 text-[#F5B800] mt-1" />
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-muted-foreground line-clamp-3">
                  {guide.description}
                </p>
                
                <div className="flex items-center justify-between text-sm text-muted-foreground">
                  <span className="flex items-center">
                    <BookOpen className="h-3 w-3 mr-1" />
                    {guide.readTime} read
                  </span>
                </div>

                <Button 
                  asChild 
                  variant="outline"
                  className="w-full border-[#F5B800] text-[#F5B800] hover:bg-[#F5B800] hover:text-white"
                >
                  <a href="#" aria-label={`Read ${guide.title}`}>
                    <ExternalLink className="h-4 w-4 mr-2" />
                    Read Guide
                  </a>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Tools Section */}
      <section className="mb-12">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold text-[#0B1E3C]">Interactive Tools</h2>
            <p className="text-muted-foreground">Calculators and tools to help with decision making</p>
          </div>
        </div>
        
        <div className="grid md:grid-cols-2 gap-6">
          {resources.tools.map((tool) => (
            <Card key={tool.id} className="hover:shadow-lg transition-all duration-200 border-0 shadow-md">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-lg text-[#0B1E3C] line-clamp-2">{tool.title}</CardTitle>
                    <CardDescription className="mt-2">
                      <Badge 
                        variant="outline" 
                        className="text-xs border-[#0B1E3C] text-[#0B1E3C] hover:bg-[#0B1E3C] hover:text-white"
                      >
                        {tool.category}
                      </Badge>
                    </CardDescription>
                  </div>
                  <tool.icon className="h-6 w-6 text-[#0B1E3C] mt-1" />
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-muted-foreground line-clamp-3">
                  {tool.description}
                </p>

                <Button 
                  asChild 
                  variant="outline"
                  className="w-full border-[#0B1E3C] text-[#0B1E3C] hover:bg-[#0B1E3C] hover:text-white"
                >
                  <a href={tool.link} aria-label={`Use ${tool.title}`}>
                    <ExternalLink className="h-4 w-4 mr-2" />
                    Use Tool
                  </a>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Call to Action */}
      <div className="text-center">
        <Card className="bg-gradient-to-r from-[#F6F7F9] to-[#eef0f3] border-0">
          <CardContent className="p-8">
            <h2 className="text-2xl font-bold text-[#0B1E3C] mb-4">Need Something Specific?</h2>
            <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
              Can't find what you're looking for? Let us know what resources would be most helpful for your startup journey.
            </p>
            <div className="flex gap-4 justify-center">
              <Button 
                asChild
                className="bg-[#21C087] hover:bg-[#1a9f6f] text-white"
              >
                <Link href="/contact">Request Resource</Link>
              </Button>
              <Button 
                variant="outline"
                className="border-[#0B1E3C] text-[#0B1E3C] hover:bg-[#0B1E3C] hover:text-white"
              >
                <ExternalLink className="h-4 w-4 mr-2" />
                Suggest Tool
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </main>
  )
}

