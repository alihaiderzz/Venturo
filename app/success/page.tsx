"use client"

import { useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { CheckCircle, ArrowRight, Zap, Crown } from "lucide-react"
import Link from "next/link"

export default function SuccessPage() {
  const searchParams = useSearchParams()
  const sessionId = searchParams.get('session_id')
  const [loading, setLoading] = useState(true)
  const [paymentDetails, setPaymentDetails] = useState<any>(null)

  useEffect(() => {
    if (sessionId) {
      // In a real app, you'd verify the session with your backend
      // For now, we'll simulate the success state
      setPaymentDetails({
        type: 'subscription', // or 'boost'
        plan: 'Venturo Pro',
        amount: '$25.00'
      })
      setLoading(false)
    }
  }, [sessionId])

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#21C087] mx-auto mb-4"></div>
          <p className="text-muted-foreground">Processing your payment...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-2xl mx-auto">
          <Card className="border-2 border-[#21C087]/20">
            <CardHeader className="text-center">
              <div className="flex justify-center mb-4">
                <CheckCircle className="h-16 w-16 text-[#21C087]" />
              </div>
              <CardTitle className="text-3xl font-bold text-[#21C087]">
                Payment Successful!
              </CardTitle>
              <CardDescription className="text-lg">
                Welcome to Venturo! Your account has been upgraded.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {paymentDetails?.type === 'subscription' ? (
                <div className="text-center space-y-4">
                  <div className="flex items-center justify-center space-x-2">
                    <Crown className="h-6 w-6 text-[#F5B800]" />
                    <span className="text-xl font-semibold">{paymentDetails.plan}</span>
                  </div>
                  <p className="text-muted-foreground">
                    Your subscription is now active. You can start using all the premium features immediately.
                  </p>
                  <div className="bg-[#21C087]/10 p-4 rounded-lg">
                    <h3 className="font-semibold mb-2">What's Next?</h3>
                    <ul className="text-sm text-muted-foreground space-y-1">
                      <li>• Upload more startup ideas</li>
                      <li>• Access premium features</li>
                      <li>• Get priority support</li>
                      <li>• Use AI Pitch Copilot credits</li>
                    </ul>
                  </div>
                </div>
              ) : (
                <div className="text-center space-y-4">
                  <div className="flex items-center justify-center space-x-2">
                    <Zap className="h-6 w-6 text-[#F5B800]" />
                    <span className="text-xl font-semibold">Boost Activated!</span>
                  </div>
                  <p className="text-muted-foreground">
                    Your listing is now boosted and will receive priority placement for 7 days.
                  </p>
                  <div className="bg-[#F5B800]/10 p-4 rounded-lg">
                    <h3 className="font-semibold mb-2">Boost Benefits:</h3>
                    <ul className="text-sm text-muted-foreground space-y-1">
                      <li>• Priority placement in search results</li>
                      <li>• Featured on homepage carousel</li>
                      <li>• Gold "Boosted" badge on your listing</li>
                      <li>• Increased visibility for 7 days</li>
                    </ul>
                  </div>
                </div>
              )}

              <div className="flex flex-col sm:flex-row gap-3 pt-4">
                <Button asChild className="flex-1 bg-[#21C087] hover:bg-[#21C087]/90">
                  <Link href="/dashboard">
                    Go to Dashboard
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
                <Button asChild variant="outline" className="flex-1">
                  <Link href="/browse">
                    Browse Ideas
                  </Link>
                </Button>
              </div>

              <div className="text-center pt-4 border-t">
                <p className="text-sm text-muted-foreground">
                  Need help? Contact us at{' '}
                  <a href="mailto:support@joinventuro.com" className="text-[#21C087] hover:underline">
                    support@joinventuro.com
                  </a>
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
