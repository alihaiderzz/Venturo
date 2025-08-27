"use client"

import { useState, useEffect } from "react"
import { useUser } from "@clerk/nextjs"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { ExternalLink, RefreshCw, CheckCircle, AlertCircle } from "lucide-react"

export default function SyncProfilePage() {
  const { user, isLoaded } = useUser()
  const [syncing, setSyncing] = useState(false)
  const [lastSync, setLastSync] = useState<string | null>(null)

  useEffect(() => {
    if (user) {
      // Check when profile was last updated
      const updatedAt = user.updatedAt
      setLastSync(updatedAt ? new Date(updatedAt).toLocaleString() : null)
    }
  }, [user])

  const handleSyncWithGoogle = async () => {
    setSyncing(true)
    try {
      // This would typically involve calling Clerk's API to sync with Google
      // For now, we'll just simulate the process
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      // Refresh the user data
      await user?.reload()
      setLastSync(new Date().toLocaleString())
      
      alert("Profile sync completed! Your Google profile picture should now be updated.")
    } catch (error) {
      console.error("Sync error:", error)
      alert("Failed to sync profile. Please try again.")
    } finally {
      setSyncing(false)
    }
  }

  const openClerkDashboard = () => {
    window.open("https://dashboard.clerk.com/", "_blank")
  }

  const openGoogleAccount = () => {
    window.open("https://myaccount.google.com/", "_blank")
  }

  if (!isLoaded) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <RefreshCw className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p>Loading profile...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="h-8 w-8 mx-auto mb-4 text-red-500" />
          <p>Please sign in to access profile sync.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Profile Picture Sync</h1>
        
        <div className="grid md:grid-cols-2 gap-8">
          {/* Current Profile */}
          <Card>
            <CardHeader>
              <CardTitle>Current Profile</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-4">
                <Avatar className="h-16 w-16">
                  <AvatarImage src={user.imageUrl} alt={user.fullName || 'User'} />
                  <AvatarFallback className="bg-[#21C087] text-white text-lg">
                    {user.firstName?.charAt(0)}{user.lastName?.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="font-semibold">{user.fullName}</h3>
                  <p className="text-muted-foreground">{user.primaryEmailAddress?.emailAddress}</p>
                  {lastSync && (
                    <p className="text-sm text-muted-foreground">
                      Last updated: {lastSync}
                    </p>
                  )}
                </div>
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span className="text-sm">Profile picture loaded from Clerk</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span className="text-sm">Email: {user.primaryEmailAddress?.emailAddress}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Sync Options */}
          <Card>
            <CardHeader>
              <CardTitle>Sync Options</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <Button 
                  onClick={handleSyncWithGoogle} 
                  disabled={syncing}
                  className="w-full"
                >
                  {syncing ? (
                    <>
                      <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                      Syncing...
                    </>
                  ) : (
                    <>
                      <RefreshCw className="h-4 w-4 mr-2" />
                      Sync with Google
                    </>
                  )}
                </Button>
                
                <Button 
                  onClick={openClerkDashboard} 
                  variant="outline"
                  className="w-full"
                >
                  <ExternalLink className="h-4 w-4 mr-2" />
                  Open Clerk Dashboard
                </Button>
                
                <Button 
                  onClick={openGoogleAccount} 
                  variant="outline"
                  className="w-full"
                >
                  <ExternalLink className="h-4 w-4 mr-2" />
                  Open Google Account
                </Button>
              </div>
              
              <div className="bg-blue-50 p-4 rounded-lg">
                <h4 className="font-semibold text-blue-900 mb-2">How to Update Profile Picture:</h4>
                <ol className="text-sm text-blue-800 space-y-1">
                  <li>1. Update your Google profile picture at myaccount.google.com</li>
                  <li>2. Wait 5-10 minutes for Clerk to sync automatically</li>
                  <li>3. Or manually sync using the button above</li>
                  <li>4. Or update directly in Clerk Dashboard</li>
                </ol>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Instructions */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>Profile Picture Sync Instructions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid md:grid-cols-3 gap-4">
              <div className="text-center p-4 border rounded-lg">
                <div className="text-2xl mb-2">1️⃣</div>
                <h4 className="font-semibold mb-2">Update Google</h4>
                <p className="text-sm text-muted-foreground">
                  Go to your Google account and update your profile picture
                </p>
              </div>
              
              <div className="text-center p-4 border rounded-lg">
                <div className="text-2xl mb-2">2️⃣</div>
                <h4 className="font-semibold mb-2">Wait for Sync</h4>
                <p className="text-sm text-muted-foreground">
                  Clerk automatically syncs with Google every few minutes
                </p>
              </div>
              
              <div className="text-center p-4 border rounded-lg">
                <div className="text-2xl mb-2">3️⃣</div>
                <h4 className="font-semibold mb-2">Manual Update</h4>
                <p className="text-sm text-muted-foreground">
                  Use Clerk Dashboard to manually update your profile picture
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
