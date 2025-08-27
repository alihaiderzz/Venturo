import { LegalNotice } from "@/components/LegalNotice"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft, Shield, FileText, AlertTriangle, Users, Lock } from "lucide-react"
import Link from "next/link"

export default function LegalPage() {
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
            <h1 className="text-xl font-semibold">Legal</h1>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <LegalNotice />
        </div>

        {/* Legal Sections */}
        <div className="grid gap-8 lg:grid-cols-2">
          {/* Terms of Service */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <FileText className="h-5 w-5 mr-2" />
                Terms of Service
              </CardTitle>
              <CardDescription>Last updated: December 2025</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 text-sm">
              <div>
                <h4 className="font-semibold mb-2">1. Acceptance of Terms</h4>
                <p className="text-muted-foreground">
                  By accessing and using Venturo, you accept and agree to be bound by the terms and provision of this agreement.
                </p>
              </div>
              <div>
                <h4 className="font-semibold mb-2">2. Platform Purpose</h4>
                <p className="text-muted-foreground">
                  Venturo is a networking and showcase platform for Australian founders, investors, and mentors. 
                  We facilitate connections but do not arrange or execute investments.
                </p>
              </div>
              <div>
                <h4 className="font-semibold mb-2">3. User Responsibilities</h4>
                <p className="text-muted-foreground">
                  Users are responsible for the accuracy of their information, maintaining confidentiality, 
                  and conducting their own due diligence on potential connections.
                </p>
              </div>
              <div>
                <h4 className="font-semibold mb-2">4. Prohibited Activities</h4>
                <p className="text-muted-foreground">
                  Users may not engage in fraudulent activities, spam, harassment, or violate any applicable laws 
                  or regulations.
                </p>
              </div>
              <div>
                <h4 className="font-semibold mb-2">5. Termination</h4>
                <p className="text-muted-foreground">
                  We reserve the right to terminate or suspend accounts that violate our terms of service.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Privacy Policy */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Lock className="h-5 w-5 mr-2" />
                Privacy Policy
              </CardTitle>
              <CardDescription>How we protect your data</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 text-sm">
              <div>
                <h4 className="font-semibold mb-2">1. Information We Collect</h4>
                <p className="text-muted-foreground">
                  We collect information you provide directly to us, including profile information, 
                  startup details, and communication preferences.
                </p>
              </div>
              <div>
                <h4 className="font-semibold mb-2">2. How We Use Information</h4>
                <p className="text-muted-foreground">
                  We use your information to provide our services, facilitate connections, 
                  improve our platform, and communicate with you.
                </p>
              </div>
              <div>
                <h4 className="font-semibold mb-2">3. Information Sharing</h4>
                <p className="text-muted-foreground">
                  We do not sell your personal information. We may share information with other users 
                  as part of our networking services, with your consent.
                </p>
              </div>
              <div>
                <h4 className="font-semibold mb-2">4. Data Security</h4>
                <p className="text-muted-foreground">
                  We implement appropriate security measures to protect your personal information 
                  against unauthorized access, alteration, or destruction.
                </p>
              </div>
              <div>
                <h4 className="font-semibold mb-2">5. Your Rights</h4>
                <p className="text-muted-foreground">
                  You have the right to access, update, or delete your personal information. 
                  Contact us to exercise these rights.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Investment Disclaimers */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <AlertTriangle className="h-5 w-5 mr-2" />
                Investment Disclaimers
              </CardTitle>
              <CardDescription>Important legal notices</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 text-sm">
              <div>
                <h4 className="font-semibold mb-2">No Investment Advice</h4>
                <p className="text-muted-foreground">
                  Venturo does not provide investment advice, financial advice, or legal advice. 
                  All investment decisions should be made after consulting with qualified professionals.
                </p>
              </div>
              <div>
                <h4 className="font-semibold mb-2">No Investment Arrangements</h4>
                <p className="text-muted-foreground">
                  We do not arrange or execute investments. All deals occur privately between users 
                  outside of our platform.
                </p>
              </div>
              <div>
                <h4 className="font-semibold mb-2">No Fund Holding</h4>
                <p className="text-muted-foreground">
                  We do not hold or manage any funds. We are not a financial institution 
                  or investment platform.
                </p>
              </div>
              <div>
                <h4 className="font-semibold mb-2">Risk Disclosure</h4>
                <p className="text-muted-foreground">
                  Investing in startups involves significant risk. Past performance does not 
                  guarantee future results. You may lose your entire investment.
                </p>
              </div>
              <div>
                <h4 className="font-semibold mb-2">Due Diligence</h4>
                <p className="text-muted-foreground">
                  Users are responsible for conducting their own due diligence on any 
                  potential investments or partnerships.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Platform Disclaimers */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Shield className="h-5 w-5 mr-2" />
                Platform Disclaimers
              </CardTitle>
              <CardDescription>Service limitations and disclaimers</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 text-sm">
              <div>
                <h4 className="font-semibold mb-2">Service Availability</h4>
                <p className="text-muted-foreground">
                  We strive to maintain high service availability but cannot guarantee 
                  uninterrupted access to our platform.
                </p>
              </div>
              <div>
                <h4 className="font-semibold mb-2">Content Accuracy</h4>
                <p className="text-muted-foreground">
                  We do not verify the accuracy of user-submitted content. Users are responsible 
                  for the information they provide.
                </p>
              </div>
              <div>
                <h4 className="font-semibold mb-2">No Guarantees</h4>
                <p className="text-muted-foreground">
                  We do not guarantee successful connections, investments, or business outcomes. 
                  Results depend on individual efforts and circumstances.
                </p>
              </div>
              <div>
                <h4 className="font-semibold mb-2">Third-Party Links</h4>
                <p className="text-muted-foreground">
                  Our platform may contain links to third-party websites. We are not responsible 
                  for the content or practices of these sites.
                </p>
              </div>
              <div>
                <h4 className="font-semibold mb-2">Limitation of Liability</h4>
                <p className="text-muted-foreground">
                  Our liability is limited to the extent permitted by law. We are not liable 
                  for indirect, incidental, or consequential damages.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Contact Information */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Users className="h-5 w-5 mr-2" />
              Contact Information
            </CardTitle>
            <CardDescription>Get in touch with our team</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="text-center">
              <h4 className="font-semibold mb-2">Get in Touch</h4>
              <p className="text-sm text-muted-foreground mb-4">
                For any questions, concerns, or support, reach out to us on Instagram:
              </p>
              <Button asChild variant="outline" className="border-accent text-accent hover:bg-accent hover:text-white">
                <a href="https://instagram.com/venturo_au" target="_blank" rel="noreferrer noopener">
                  @venturo_au
                </a>
              </Button>
            </div>
            <div className="pt-4 border-t">
              <p className="text-sm text-muted-foreground">
                <strong>Note:</strong> This legal information is provided for general guidance only. 
                For specific legal advice, please consult with a qualified legal professional.
              </p>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}

