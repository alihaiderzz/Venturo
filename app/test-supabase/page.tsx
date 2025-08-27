"use client"
import { useState, useEffect } from "react"

export default function TestSupabase() {
  const [ideas, setIdeas] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    fetchIdeas()
  }, [])

  const fetchIdeas = async () => {
    try {
      const res = await fetch("/api/get-ideas")
      const data = await res.json()
      
      if (res.ok) {
        setIdeas(data.data || [])
      } else {
        setError(data.error || "Failed to fetch ideas")
      }
    } catch (err) {
      setError("Network error")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Supabase Connection Test</h1>
      
      <div className="mb-6">
        <h2 className="text-lg font-semibold mb-2">Ideas from Supabase:</h2>
        
        {loading && <p>Loading ideas...</p>}
        {error && <p className="text-red-600">Error: {error}</p>}
        
        {ideas.length === 0 && !loading && !error && (
          <p className="text-gray-600">No ideas found. Try uploading one first!</p>
        )}
        
        {ideas.length > 0 && (
          <div className="space-y-4">
            {ideas.map((idea: any) => (
              <div key={idea.id} className="border p-4 rounded">
                <h3 className="font-semibold">{idea.title}</h3>
                <p className="text-gray-600">{idea.description}</p>
                <p className="text-sm text-gray-500">Category: {idea.category}</p>
                <p className="text-sm text-gray-500">Created by: {idea.created_by}</p>
                <p className="text-sm text-gray-500">Created: {new Date(idea.created_at).toLocaleDateString()}</p>
              </div>
            ))}
          </div>
        )}
      </div>
      
      <div className="mb-4">
        <button 
          onClick={fetchIdeas}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Refresh Ideas
        </button>
      </div>
      
      <div className="text-sm text-gray-600">
        <p>✅ If you see ideas above, Supabase is working!</p>
        <p>✅ If you see "No ideas found", the connection works but table is empty.</p>
        <p>❌ If you see an error, there's a connection issue.</p>
      </div>
    </div>
  )
}
