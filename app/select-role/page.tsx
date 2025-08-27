"use client"
import { useRouter } from "next/navigation"
import { UserRoleSelector } from "@/components/UserRoleSelector"
import { SignedIn, SignedOut, RedirectToSignIn } from "@clerk/nextjs"

export default function SelectRolePage() {
  const router = useRouter()

  const handleRoleSelect = (role: 'founder' | 'creator' | 'backer') => {
    // TODO: Save role to user profile in database
    console.log('Selected role:', role)
    
    // Redirect to dashboard or onboarding
    router.push('/dashboard')
  }

  const handleSkip = () => {
    router.push('/dashboard')
  }

  return (
    <>
      <SignedOut>
        <RedirectToSignIn />
      </SignedOut>
      <SignedIn>
        <UserRoleSelector onRoleSelect={handleRoleSelect} onSkip={handleSkip} />
      </SignedIn>
    </>
  )
}
