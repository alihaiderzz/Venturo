"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"

export default function DebugFeatureButton() {
  const [feedbackId, setFeedbackId] = useState("")
  const [result, setResult] = useState<any>(null)
  const [loading, setLoading] = useState(false)

  const testFeatureButton = async () => {
    if (!feedbackId) return
    
    setLoading(true)
    try {
      console.log('Testing feature button for feedback ID:', feedbackId)
      
      // Test the PATCH request
      const response = await fetch(`/api/admin/feedback/${feedbackId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ is_featured: true })
      })

      const data = await response.json()
      console.log('Feature button response:', data)
      setResult(data)

      if (response.ok) {
        // Test if it appears on homepage
        setTimeout(async () => {
          const homepageResponse = await fetch('/api/feedback')
          const homepageData = await homepageResponse.json()
          console.log('Homepage feedback after feature:', homepageData)
          setResult(prev => ({ ...prev, homepageData }))
        }, 1000)
      }
    } catch (error) {
      console.error('Error testing feature button:', error)
      setResult({ error: error.message })
    } finally {
      setLoading(false)
    }
  }

  const fetchAllFeedback = async () => {
    setLoading(true)
    try {
      const response = await fetch('/api/admin/feedback')
      const data = await response.json()
      console.log('All feedback:', data)
      setResult(data)
    } catch (error) {
      console.error('Error fetching all feedback:', error)
      setResult({ error: error.message })
    } finally {
      setLoading(false)
    }
  }

  const fetchHomepageFeedback = async () => {
    setLoading(true)
    try {
      const response = await fetch('/api/feedback')
      const data = await response.json()
      console.log('Homepage feedback:', data)
      setResult(data)
    } catch (error) {
      console.error('Error fetching homepage feedback:', error)
      setResult({ error: error.message })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Debug Feature Button</h1>
        
        <div className="space-y-4 mb-8">
          <div className="flex gap-2">
            <Input 
              placeholder="Enter feedback ID to test"
              value={feedbackId}
              onChange={(e) => setFeedbackId(e.target.value)}
            />
            <Button onClick={testFeatureButton} disabled={loading || !feedbackId}>
              Test Feature Button
            </Button>
          </div>
          
          <div className="flex gap-2">
            <Button onClick={fetchAllFeedback} variant="outline" disabled={loading}>
              Fetch All Feedback
            </Button>
            <Button onClick={fetchHomepageFeedback} variant="outline" disabled={loading}>
              Fetch Homepage Feedback
            </Button>
          </div>
        </div>

        {result && (
          <Card>
            <CardContent className="p-4">
              <h3 className="font-semibold mb-2">Result:</h3>
              <pre className="bg-gray-100 p-4 rounded text-sm overflow-auto">
                {JSON.stringify(result, null, 2)}
              </pre>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
