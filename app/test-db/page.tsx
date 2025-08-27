"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function TestDBPage() {
  const [testResult, setTestResult] = useState<string>("")
  const [loading, setLoading] = useState(false)

  const testDatabase = async () => {
    setLoading(true)
    setTestResult("Testing database connection...")
    
    try {
      // Test 1: Check if we can fetch user profile
      const response = await fetch('/api/user-profile')
      const result = await response.json()
      
      setTestResult(prev => prev + "\n\n1. User Profile API Response:")
      setTestResult(prev => prev + `\nStatus: ${response.status}`)
      setTestResult(prev => prev + `\nData: ${JSON.stringify(result, null, 2)}`)
      
      // Test 2: Try to create a test profile
      const testData = {
        email: "test@example.com",
        full_name: "Test User",
        role: "founder",
        bio: "Test bio",
        location: "Test Location",
        website: "test.com",
        company: "Test Company"
      }
      
      const createResponse = await fetch('/api/user-profile', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(testData),
      })
      
      const createResult = await createResponse.json()
      
      setTestResult(prev => prev + "\n\n2. Create Profile API Response:")
      setTestResult(prev => prev + `\nStatus: ${createResponse.status}`)
      setTestResult(prev => prev + `\nData: ${JSON.stringify(createResult, null, 2)}`)
      
    } catch (error) {
      setTestResult(prev => prev + `\n\nError: ${error}`)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <Card>
        <CardHeader>
          <CardTitle>Database Connection Test</CardTitle>
        </CardHeader>
        <CardContent>
          <Button 
            onClick={testDatabase} 
            disabled={loading}
            className="mb-4"
          >
            {loading ? "Testing..." : "Test Database Connection"}
          </Button>
          
          {testResult && (
            <div className="bg-gray-100 p-4 rounded-lg">
              <pre className="text-sm whitespace-pre-wrap">{testResult}</pre>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

