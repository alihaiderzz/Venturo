import { NextRequest, NextResponse } from "next/server"
import { auth } from "@clerk/nextjs/server"
import { uploadImage } from "@/lib/cloudinary"

export async function POST(req: NextRequest) {
  try {
    const { userId } = await auth()
    if (!userId) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      )
    }

    const formData = await req.formData()
    const file = formData.get('file') as File

    if (!file) {
      return NextResponse.json(
        { error: "No file provided" },
        { status: 400 }
      )
    }

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif']
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        { error: "Invalid file type. Only JPEG, PNG, WebP, and GIF are allowed." },
        { status: 400 }
      )
    }

    // Validate file size (5MB limit)
    const maxSize = 5 * 1024 * 1024 // 5MB
    if (file.size > maxSize) {
      return NextResponse.json(
        { error: "File too large. Maximum size is 5MB." },
        { status: 400 }
      )
    }

    // Convert file to buffer
    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)

    // Generate unique public_id
    const timestamp = Date.now()
    const randomId = Math.random().toString(36).substring(2, 15)
    const public_id = `venturo_${timestamp}_${randomId}`

    // Upload to Cloudinary
    const uploadResult = await uploadImage(buffer, {
      public_id,
      folder: 'venturo',
      transformation: {
        fetch_format: 'auto',
        quality: 'auto'
      }
    })

    if (!uploadResult.success) {
      return NextResponse.json(
        { error: uploadResult.error || "Upload failed" },
        { status: 500 }
      )
    }
    
    return NextResponse.json({ 
      success: true, 
      url: uploadResult.url,
      public_id: uploadResult.public_id,
      width: uploadResult.width,
      height: uploadResult.height,
      message: "Image uploaded successfully!"
    })
  } catch (error) {
    console.error("Upload error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
