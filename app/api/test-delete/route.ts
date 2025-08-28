import { NextRequest, NextResponse } from "next/server"
import { supabase } from "@/lib/supabaseClient"
import { auth } from "@clerk/nextjs/server"

export async function GET(request: NextRequest) {
  try {
    const { userId } = await auth()
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Test if RPC function exists
    const { data: rpcTest, error: rpcError } = await supabase()
      .rpc('delete_user_idea', {
        idea_id: 'test-id',
        user_clerk_id: userId
      })

    return NextResponse.json({
      rpcExists: !rpcError || rpcError.code !== '42883', // 42883 = function does not exist
      rpcError: rpcError,
      userId: userId
    })
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
