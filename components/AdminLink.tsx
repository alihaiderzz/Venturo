"use client"

import Link from "next/link"
import { useUser } from "@clerk/nextjs"

const ADMIN_EMAILS = new Set([
  "sm.alihaider.nz@gmail.com",
  "hello@joinventuro.com",
  "team@joinventuro.com",
  "founder@venturo.com",
])

export function AdminLink({ className = "" }: { className?: string }) {
  const { user } = useUser()
  const email = user?.primaryEmailAddress?.emailAddress || ""
  const isAdmin = email && ADMIN_EMAILS.has(email)

  if (!isAdmin) return null

  return (
    <Link href="/admin/events" className={`text-sm font-medium text-[#21C087] hover:underline ${className}`}>
      Admin
    </Link>
  )
}
