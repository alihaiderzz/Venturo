import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { SignInButton, SignUpButton, SignedIn, SignedOut } from '@clerk/nextjs'
import { UserProfileButton } from '@/components/UserProfileButton'
import { ArrowLeft } from "lucide-react"

export function PricingHeader() {
  return (
    <header className="bg-white border-b border-gray-200 shadow-sm">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Button variant="ghost" size="sm" asChild>
              <Link href="/" aria-label="Back to home">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back
              </Link>
            </Button>
            <Link href="/">
              <Image
                src="/venturo-logo-full.png"
                alt="Venturo"
                width={180}
                height={60}
                className="h-10 md:h-12 w-auto"
              />
            </Link>
          </div>
          <nav className="hidden md:flex items-center space-x-8">
            <Link href="/#how-it-works" className="text-foreground hover:text-primary transition-colors font-medium">
              How it Works
            </Link>
            <Link href="/#why-venturo" className="text-foreground hover:text-primary transition-colors font-medium">
              Why Venturo
            </Link>
            <Link href="/browse" className="text-foreground hover:text-primary transition-colors font-medium">
              Browse Ideas
            </Link>
            <Link href="/pricing" className="text-primary font-medium">
              Pricing
            </Link>
            <SignedOut>
              <SignInButton>
                <Button variant="outline" className="font-medium bg-transparent">
                  Sign In
                </Button>
              </SignInButton>
              <SignUpButton>
                <Button className="bg-primary hover:bg-primary/90 text-white font-medium">
                  Get Started
                </Button>
              </SignUpButton>
            </SignedOut>
            <SignedIn>
              <UserProfileButton />
            </SignedIn>
          </nav>
          <div className="md:hidden flex items-center space-x-2">
            <SignedOut>
              <SignInButton>
                <Button variant="ghost" size="sm">
                  Sign In
                </Button>
              </SignInButton>
              <SignUpButton>
                <Button size="sm" className="bg-primary hover:bg-primary/90 text-white">
                  Get Started
                </Button>
              </SignUpButton>
            </SignedOut>
            <SignedIn>
              <UserProfileButton />
            </SignedIn>
          </div>
        </div>
      </div>
    </header>
  )
}
