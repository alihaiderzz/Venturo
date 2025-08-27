"use client"
import { useState } from "react"
import { useUser } from "@clerk/nextjs"

export default function TestUpload() {
  const { user } = useUser()
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [category, setCategory] = useState("")
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!user) {
      setMessage("❌ You must be signed in to upload an idea.")
      return
    }

    setLoading(true)
    setMessage("")

    try {
      const res = await fetch("/api/upload-idea", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          description,
          category,
          created_by: user.id, // Clerk user ID
        }),
      })

      const data = await res.json()

      if (res.ok) {
        setMessage("✅ Idea uploaded successfully!")
        setTitle("")
        setDescription("")
        setCategory("")
      } else {
        setMessage(`❌ Error: ${data.error}`)
      }
    } catch (error) {
      setMessage("❌ Network error. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-md mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Test Supabase Upload</h1>
      
      {!user && (
        <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded mb-4">
          Please sign in to upload ideas.
        </div>
      )}
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <input 
            value={title} 
            onChange={e => setTitle(e.target.value)} 
            placeholder="Title" 
            className="w-full border p-2 rounded" 
            required
          />
        </div>
        <div>
          <textarea 
            value={description} 
            onChange={e => setDescription(e.target.value)} 
            placeholder="Description" 
            className="w-full border p-2 rounded" 
            rows={4}
            required
          />
        </div>
        <div>
          <input 
            value={category} 
            onChange={e => setCategory(e.target.value)} 
            placeholder="Category" 
            className="w-full border p-2 rounded" 
            required
          />
        </div>
        <button 
          type="submit" 
          className="w-full bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 disabled:opacity-50"
          disabled={loading || !user}
        >
          {loading ? "Uploading..." : "Upload Idea"}
        </button>
      </form>
      
      {message && (
        <div className={`mt-4 p-3 rounded ${
          message.includes("✅") ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
        }`}>
          {message}
        </div>
      )}
      
      {user && (
        <div className="mt-4 text-sm text-gray-600">
          Signed in as: {user.emailAddresses[0]?.emailAddress}
        </div>
      )}
    </div>
  )
}
