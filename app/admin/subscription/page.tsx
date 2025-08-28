"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Crown, User, DollarSign, Calendar } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import Link from "next/link"
import { SignedIn, SignedOut, RedirectToSignIn } from "@clerk/nextjs"

export default function AdminSubscriptionPage() {
  return (
    <>
      <SignedOut>
        <RedirectToSignIn />
      </SignedOut>
      <SignedIn>
        <AdminSubscriptionContent />
      </SignedIn>
    </>
  )
}

function AdminSubscriptionContent() {
  const { toast } = useToast()
  const [userEmail, setUserEmail] = useState("")
  const [subscriptionTier, setSubscriptionTier] = useState("")
  const [expiresAt, setExpiresAt] = useState("")
  const [loading, setLoading] = useState(false)
  const [userProfile, setUserProfile] = useState<any>(null)

  const handleSearchUser = async () => {
    if (!userEmail) {
      toast({
        title: "Error",
        description: "Please enter a user email",
        variant: "destructive",
      })
      return
    }

    setLoading(true)
    try {
      const response = await fetch(`/api/admin/subscription?email=${encodeURIComponent(userEmail)}`)
      if (response.ok) {
        const data = await response.json()
        setUserProfile(data.userProfile)
      } else {
        const error = await response.json()
        toast({
          title: "Error",
          description: error.error || "Failed to find user",
          variant: "destructive",
        })
        setUserProfile(null)
      }
    } catch (error) {
      console.error("Error searching user:", error)
      toast({
        title: "Error",
        description: "Failed to search user",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleUpdateSubscription = async () => {
    if (!userEmail || !subscriptionTier) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      })
      return
    }

    setLoading(true)
    try {
      const response = await fetch('/api/admin/subscription', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userEmail,
          subscriptionTier,
          expiresAt: expiresAt || null
        }),
      })

      if (response.ok) {
        const data = await response.json()
        toast({
          title: "Success",
          description: data.message,
        })
        setUserProfile(data.userProfile)
        setSubscriptionTier("")
        setExpiresAt("")
      } else {
        const error = await response.json()
        toast({
          title: "Error",
          description: error.error || "Failed to update subscription",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Error updating subscription:", error)
      toast({
        title: "Error",
        description: "Failed to update subscription",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const getSubscriptionBadge = (tier: string) => {
    switch (tier) {
      case 'premium':
        return <Badge className="bg-[#F5B800] text-black">Premium</Badge>
      case 'investor':
        return <Badge className="bg-[#21C087] text-white">Investor</Badge>
      default:
        return <Badge variant="outline">Free</Badge>
    }
  }

  return (
    <div className="min-h-screen bg-[#F6F7F9]">
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-4">
            <Button variant="ghost" size="sm" asChild>
              <Link href="/admin/events" aria-label="Back to admin">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back
              </Link>
            </Button>
            <div>
              <h1 className="text-3xl font-bold">Subscription Management</h1>
              <p className="text-muted-foreground">Manage user subscriptions and access levels</p>
            </div>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          {/* Search User */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                Search User
              </CardTitle>
              <CardDescription>
                Find a user by email to manage their subscription
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="email">User Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={userEmail}
                  onChange={(e) => setUserEmail(e.target.value)}
                  placeholder="user@example.com"
                />
              </div>
              <Button 
                onClick={handleSearchUser} 
                disabled={loading || !userEmail}
                className="w-full"
              >
                {loading ? "Searching..." : "Search User"}
              </Button>
            </CardContent>
          </Card>

          {/* Update Subscription */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Crown className="h-5 w-5" />
                Update Subscription
              </CardTitle>
              <CardDescription>
                Change user's subscription tier and expiration
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="tier">Subscription Tier</Label>
                <Select value={subscriptionTier} onValueChange={setSubscriptionTier}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select tier" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="free">Free</SelectItem>
                    <SelectItem value="premium">Premium</SelectItem>
                    <SelectItem value="investor">Investor</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="expires">Expires At (Optional)</Label>
                <Input
                  id="expires"
                  type="datetime-local"
                  value={expiresAt}
                  onChange={(e) => setExpiresAt(e.target.value)}
                />
              </div>
              <Button 
                onClick={handleUpdateSubscription} 
                disabled={loading || !subscriptionTier}
                className="w-full bg-[#21C087] hover:bg-[#1a9f6f]"
              >
                {loading ? "Updating..." : "Update Subscription"}
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* User Profile Display */}
        {userProfile && (
          <Card className="mt-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                User Profile
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <Label className="text-sm font-medium">Email</Label>
                  <p className="text-sm text-muted-foreground">{userProfile.email}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Current Subscription</Label>
                  <div className="flex items-center gap-2 mt-1">
                    {getSubscriptionBadge(userProfile.subscription_tier)}
                  </div>
                </div>
                {userProfile.subscription_expires_at && (
                  <div>
                    <Label className="text-sm font-medium">Expires At</Label>
                    <p className="text-sm text-muted-foreground">
                      {new Date(userProfile.subscription_expires_at).toLocaleDateString()}
                    </p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Subscription Tiers Info */}
        <Card className="mt-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <DollarSign className="h-5 w-5" />
              Subscription Tiers
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-3">
              <div className="p-4 border rounded-lg">
                <h4 className="font-semibold mb-2">Free</h4>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• 1 active idea</li>
                  <li>• Basic profile</li>
                  <li>• Browse ideas</li>
                </ul>
              </div>
              <div className="p-4 border rounded-lg bg-[#F5B800]/10">
                <h4 className="font-semibold mb-2">Premium</h4>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• Unlimited ideas</li>
                  <li>• Priority listing</li>
                  <li>• Advanced analytics</li>
                  <li>• Direct messaging</li>
                </ul>
              </div>
              <div className="p-4 border rounded-lg bg-[#21C087]/10">
                <h4 className="font-semibold mb-2">Investor</h4>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• All Premium features</li>
                  <li>• Due diligence tools</li>
                  <li>• Investment tracking</li>
                  <li>• Exclusive events</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
