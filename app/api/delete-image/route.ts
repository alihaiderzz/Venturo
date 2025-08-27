import { NextRequest, NextResponse } from "next/server"
import { auth } from "@clerk/nextjs/server"
import { deleteImage } from "@/lib/cloudinary"

export async function POST(req: NextRequest) {
  try {
    const { userId } = await auth()
    if (!userId) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      )
    }

    const body = await req.json()
    const { public_id } = body

    if (!public_id) {
      return NextResponse.json(
        { error: "Public ID is required" },
        { status: 400 }
      )
    }

    // Delete from Cloudinary
    const deleteResult = await deleteImage(public_id)

    if (!deleteResult.success) {
      return NextResponse.json(
        { error: deleteResult.error || "Failed to delete image" },
        { status: 500 }
      )
    }
    
    return NextResponse.json({ 
      success: true,
      message: "Image deleted successfully!"
    })
  } catch (error) {
    console.error("Delete error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
