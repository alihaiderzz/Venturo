"use client"

import { useState, useEffect } from "react"

export default function TestPage() {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const testFetch = async () => {
      try {
        setLoading(true)
        const res = await fetch('/api/feedback')
        const data = await res.json()
        console.log('API Response:', data)
        setLoading(false)
      } catch (err) {
        console.error('Fetch error:', err)
        setError(err instanceof Error ? err.message : 'Unknown error')
        setLoading(false)
      }
    }

    testFetch()
  }, [])

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Test Page</h1>
        
        <div className="space-y-4">
          <div className="p-4 border rounded">
            <h2 className="font-semibold mb-2">Page Status:</h2>
            <p>Loading: {loading ? 'Yes' : 'No'}</p>
            <p>Error: {error || 'None'}</p>
          </div>
          
          <div className="p-4 border rounded">
            <h2 className="font-semibold mb-2">Basic Content Test:</h2>
            <p>This is a test paragraph to see if content renders.</p>
            <button className="bg-blue-500 text-white px-4 py-2 rounded">
              Test Button
            </button>
          </div>
          
          <div className="p-4 border rounded">
            <h2 className="font-semibold mb-2">Navigation Test:</h2>
            <a href="/" className="text-blue-500 underline">Go to Homepage</a>
          </div>
        </div>
      </div>
    </div>
  )
}
