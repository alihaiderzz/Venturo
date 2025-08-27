"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Upload, CheckCircle, XCircle } from "lucide-react"

export default function TestCloudinaryPage() {
  const [uploading, setUploading] = useState(false)
  const [uploadResult, setUploadResult] = useState<any>(null)
  const [error, setError] = useState<string | null>(null)

  const handleTestUpload = async () => {
    setUploading(true)
    setError(null)
    setUploadResult(null)

    try {
      // Create a simple test image (1x1 pixel PNG)
      const canvas = document.createElement('canvas')
      canvas.width = 1
      canvas.height = 1
      const ctx = canvas.getContext('2d')
      ctx!.fillStyle = '#21C087'
      ctx!.fillRect(0, 0, 1, 1)
      
      canvas.toBlob(async (blob) => {
        if (!blob) {
          setError('Failed to create test image')
          setUploading(false)
          return
        }

        const file = new File([blob], 'test.png', { type: 'image/png' })
        const formData = new FormData()
        formData.append('file', file)

        const res = await fetch('/api/upload-image', {
          method: 'POST',
          body: formData
        })

        if (res.ok) {
          const data = await res.json()
          setUploadResult(data)
        } else {
          const errorData = await res.json()
          setError(errorData.error || 'Upload failed')
        }
        setUploading(false)
      }, 'image/png')
    } catch (err) {
      setError('Test failed')
      setUploading(false)
    }
  }

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-2xl mx-auto">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Upload className="h-5 w-5" />
              Cloudinary Integration Test
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-muted-foreground">
              This page tests if Cloudinary is properly configured and working.
            </p>
            
            <Button 
              onClick={handleTestUpload} 
              disabled={uploading}
              className="w-full"
            >
              {uploading ? "Testing Upload..." : "Test Image Upload"}
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

            {uploadResult && (
              <div className="space-y-4">
                <div className="flex items-center gap-2 p-4 bg-green-50 border border-green-200 rounded-lg">
                  <CheckCircle className="h-5 w-5 text-green-500" />
                  <div>
                    <p className="font-medium text-green-800">Success!</p>
                    <p className="text-sm text-green-600">Image uploaded to Cloudinary</p>
                  </div>
                </div>

                <div className="space-y-2">
                  <h4 className="font-medium">Upload Result:</h4>
                  <div className="bg-gray-50 p-3 rounded text-sm">
                    <p><strong>URL:</strong> {uploadResult.url}</p>
                    <p><strong>Public ID:</strong> {uploadResult.public_id}</p>
                    <p><strong>Width:</strong> {uploadResult.width}</p>
                    <p><strong>Height:</strong> {uploadResult.height}</p>
                  </div>
                </div>

                {uploadResult.url && (
                  <div className="space-y-2">
                    <h4 className="font-medium">Uploaded Image:</h4>
                    <img 
                      src={uploadResult.url} 
                      alt="Test upload" 
                      className="border rounded-lg max-w-xs"
                    />
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
