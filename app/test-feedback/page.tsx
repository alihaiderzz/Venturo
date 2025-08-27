"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function TestFeedbackPage() {
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<string>("")
  const [formData, setFormData] = useState({
    quote: "This is a test feedback submission",
    author_name: "Test User",
    author_role: "Founder",
    rating: 5
  })

  const submitFeedback = async () => {
    setLoading(true)
    setResult("")
    
    try {
      const response = await fetch('/api/feedback', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
      })

      const data = await response.json()
      
      if (response.ok) {
        setResult(`✅ Success: ${JSON.stringify(data, null, 2)}`)
      } else {
        setResult(`❌ Error: ${JSON.stringify(data, null, 2)}`)
      }
    } catch (error) {
      setResult(`❌ Network Error: ${error}`)
    } finally {
      setLoading(false)
    }
  }

  const checkFeedback = async () => {
    setLoading(true)
    setResult("")
    
    try {
      const response = await fetch('/api/feedback')
      const data = await response.json()
      
      if (response.ok) {
        setResult(`📋 Current Feedback: ${JSON.stringify(data, null, 2)}`)
      } else {
        setResult(`❌ Error: ${JSON.stringify(data, null, 2)}`)
      }
    } catch (error) {
      setResult(`❌ Network Error: ${error}`)
    } finally {
      setLoading(false)
    }
  }

  const checkAdminFeedback = async () => {
    setLoading(true)
    setResult("")
    
    try {
      const response = await fetch('/api/admin/feedback')
      const data = await response.json()
      
      if (response.ok) {
        setResult(`👑 Admin Feedback: ${JSON.stringify(data, null, 2)}`)
      } else {
        setResult(`❌ Admin Error: ${JSON.stringify(data, null, 2)}`)
      }
    } catch (error) {
      setResult(`❌ Network Error: ${error}`)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Feedback Test Page</h1>
        
        <div className="grid md:grid-cols-2 gap-8">
          {/* Test Form */}
          <Card>
            <CardHeader>
              <CardTitle>Test Feedback Submission</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Quote</label>
                <Textarea
                  value={formData.quote}
                  onChange={(e) => setFormData({...formData, quote: e.target.value})}
                  placeholder="Enter your feedback quote"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2">Author Name</label>
                <Input
                  value={formData.author_name}
                  onChange={(e) => setFormData({...formData, author_name: e.target.value})}
                  placeholder="Your name"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2">Author Role</label>
                <Input
                  value={formData.author_role}
                  onChange={(e) => setFormData({...formData, author_role: e.target.value})}
                  placeholder="Founder, Backer, etc."
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2">Rating</label>
                <Input
                  type="number"
                  min="1"
                  max="5"
                  value={formData.rating}
                  onChange={(e) => setFormData({...formData, rating: parseInt(e.target.value)})}
                />
              </div>
              
              <Button 
                onClick={submitFeedback} 
                disabled={loading}
                className="w-full"
              >
                {loading ? "Submitting..." : "Submit Test Feedback"}
              </Button>
            </CardContent>
          </Card>

          {/* Test Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Test Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button 
                onClick={checkFeedback} 
                disabled={loading}
                variant="outline"
                className="w-full"
              >
                Check Public Feedback
              </Button>
              
              <Button 
                onClick={checkAdminFeedback} 
                disabled={loading}
                variant="outline"
                className="w-full"
              >
                Check Admin Feedback
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Results */}
        {result && (
          <Card className="mt-8">
            <CardHeader>
              <CardTitle>Test Results</CardTitle>
            </CardHeader>
            <CardContent>
              <pre className="bg-muted p-4 rounded-lg overflow-auto text-sm">
                {result}
              </pre>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
