"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function TestDeletePage() {
  const [testResult, setTestResult] = useState<any>(null)
  const [loading, setLoading] = useState(false)

  const testRPC = async () => {
    setLoading(true)
    try {
      const response = await fetch('/api/test-delete')
      const data = await response.json()
      setTestResult(data)
    } catch (error) {
      setTestResult({ error: error.message })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container mx-auto p-8">
      <Card>
        <CardHeader>
          <CardTitle>Test Delete Functionality</CardTitle>
        </CardHeader>
        <CardContent>
          <Button onClick={testRPC} disabled={loading}>
            {loading ? "Testing..." : "Test RPC Function"}
          </Button>
          
          {testResult && (
            <div className="mt-4 p-4 bg-gray-100 rounded">
              <pre>{JSON.stringify(testResult, null, 2)}</pre>
            </div>
          )}
          
          <div className="mt-4 text-sm text-gray-600">
            <p>This will test if the RPC function exists and if you're authenticated.</p>
            <p>If RPC function doesn't exist, run the SQL in create-delete-rpc.sql in your Supabase dashboard.</p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
