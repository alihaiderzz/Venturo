"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { CheckCircle, ArrowRight, Home, User } from "lucide-react"
import Link from "next/link"
import { useSearchParams } from "next/navigation"

export default function SuccessPage() {
  const searchParams = useSearchParams()
  const sessionId = searchParams.get('session_id')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // You can verify the session here if needed
    setLoading(false)
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#21C087] mx-auto mb-4"></div>
          <p>Processing your payment...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-2xl mx-auto text-center">
          {/* Success Icon */}
          <div className="mb-8">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="h-10 w-10 text-green-600" />
            </div>
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Payment Successful! 🎉
            </h1>
            <p className="text-xl text-gray-600 mb-8">
              Welcome to Venturo! Your subscription has been activated.
            </p>
          </div>

          {/* Success Card */}
          <Card className="bg-white/70 mb-8">
            <CardHeader>
              <CardTitle className="text-2xl text-green-600">What's Next?</CardTitle>
              <CardDescription>
                Here's what you can do now with your new subscription
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="text-left p-4 bg-green-50 rounded-lg">
                  <h3 className="font-semibold text-green-800 mb-2">📝 Create More Ideas</h3>
                  <p className="text-sm text-green-700">
                    Upload additional startup ideas and reach more potential collaborators
                  </p>
                </div>
                <div className="text-left p-4 bg-blue-50 rounded-lg">
                  <h3 className="font-semibold text-blue-800 mb-2">🚀 Boost Your Listings</h3>
                  <p className="text-sm text-blue-700">
                    Get priority placement and increase visibility for your ideas
                  </p>
                </div>
                <div className="text-left p-4 bg-purple-50 rounded-lg">
                  <h3 className="font-semibold text-purple-800 mb-2">📊 View Analytics</h3>
                  <p className="text-sm text-purple-700">
                    Track views, saves, and engagement with your startup ideas
                  </p>
                </div>
                <div className="text-left p-4 bg-orange-50 rounded-lg">
                  <h3 className="font-semibold text-orange-800 mb-2">🎯 Access Premium Features</h3>
                  <p className="text-sm text-orange-700">
                    Use AI Pitch Copilot and advanced search filters
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild className="bg-[#21C087] hover:bg-[#1a9f6f] text-white">
              <Link href="/create">
                <ArrowRight className="h-4 w-4 mr-2" />
                Upload Your First Idea
              </Link>
            </Button>
            <Button asChild variant="outline">
              <Link href="/dashboard">
                <User className="h-4 w-4 mr-2" />
                Go to Dashboard
              </Link>
            </Button>
            <Button asChild variant="outline">
              <Link href="/">
                <Home className="h-4 w-4 mr-2" />
                Back to Home
              </Link>
            </Button>
          </div>

          {/* Session Info (for debugging) */}
          {sessionId && (
            <div className="mt-8 p-4 bg-gray-100 rounded-lg">
              <p className="text-sm text-gray-600">
                Session ID: <code className="bg-gray-200 px-2 py-1 rounded">{sessionId}</code>
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
