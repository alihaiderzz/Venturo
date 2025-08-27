"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { CheckCircle, XCircle, Database, Loader2 } from "lucide-react"

export default function TestDbUpdatesPage() {
  const [loading, setLoading] = useState(false)
  const [results, setResults] = useState<any>(null)
  const [error, setError] = useState<string | null>(null)

  const testDatabaseUpdates = async () => {
    setLoading(true)
    setError(null)
    setResults(null)

    try {
      // Test 1: Check if new tables exist
      const tablesRes = await fetch('/api/test-db-tables')
      const tablesData = await tablesRes.json()

      // Test 2: Check if new columns exist
      const columnsRes = await fetch('/api/test-db-columns')
      const columnsData = await columnsRes.json()

      // Test 3: Test community feedback functionality
      const feedbackRes = await fetch('/api/feedback')
      const feedbackData = await feedbackRes.json()

      setResults({
        tables: tablesData,
        columns: columnsData,
        feedback: feedbackData
      })
    } catch (err) {
      setError('Failed to test database updates')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-4xl mx-auto space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Database className="h-5 w-5" />
              Database Updates Test
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-muted-foreground">
              This page tests if all the database updates from database-updates.sql were applied successfully.
            </p>
            
            <Button 
              onClick={testDatabaseUpdates} 
              disabled={loading}
              className="w-full"
            >
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Testing Database Updates...
                </>
              ) : (
                "Test Database Updates"
              )}
            </Button>

            {error && (
              <div className="flex items-center gap-2 p-4 bg-red-50 border border-red-200 rounded-lg">
                <XCircle className="h-5 w-5 text-red-500" />
                <div>
                  <p className="font-medium text-red-800">Error</p>
                  <p className="text-sm text-red-600">{error}</p>
                </div>
              </div>
            )}

            {results && (
              <div className="space-y-6">
                {/* Tables Test */}
                <div className="space-y-2">
                  <h4 className="font-medium flex items-center gap-2">
                    <Database className="h-4 w-4" />
                    New Tables Test
                  </h4>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    {results.tables.success ? (
                      <div className="flex items-center gap-2 text-green-600">
                        <CheckCircle className="h-4 w-4" />
                        <span>✅ All new tables created successfully!</span>
                      </div>
                    ) : (
                      <div className="flex items-center gap-2 text-red-600">
                        <XCircle className="h-4 w-4" />
                        <span>❌ Some tables are missing: {results.tables.missing?.join(', ')}</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Columns Test */}
                <div className="space-y-2">
                  <h4 className="font-medium flex items-center gap-2">
                    <Database className="h-4 w-4" />
                    New Columns Test
                  </h4>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    {results.columns.success ? (
                      <div className="flex items-center gap-2 text-green-600">
                        <CheckCircle className="h-4 w-4" />
                        <span>✅ All new columns added successfully!</span>
                      </div>
                    ) : (
                      <div className="flex items-center gap-2 text-red-600">
                        <XCircle className="h-4 w-4" />
                        <span>❌ Some columns are missing: {results.columns.missing?.join(', ')}</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Feedback API Test */}
                <div className="space-y-2">
                  <h4 className="font-medium flex items-center gap-2">
                    <Database className="h-4 w-4" />
                    Community Feedback API Test
                  </h4>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    {results.feedback.success ? (
                      <div className="flex items-center gap-2 text-green-600">
                        <CheckCircle className="h-4 w-4" />
                        <span>✅ Feedback API working! Found {results.feedback.count} feedback entries</span>
                      </div>
                    ) : (
                      <div className="flex items-center gap-2 text-red-600">
                        <XCircle className="h-4 w-4" />
                        <span>❌ Feedback API failed: {results.feedback.error}</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Overall Status */}
                <div className="p-4 border rounded-lg">
                  <h4 className="font-medium mb-2">Overall Status</h4>
                  {results.tables.success && results.columns.success && results.feedback.success ? (
                    <div className="flex items-center gap-2 text-green-600">
                      <CheckCircle className="h-5 w-5" />
                      <span className="font-medium">🎉 All database updates successful! Your Venturo platform is fully functional.</span>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2 text-red-600">
                      <XCircle className="h-5 w-5" />
                      <span className="font-medium">⚠️ Some updates failed. Please run the database-updates.sql script again.</span>
                    </div>
                  )}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
