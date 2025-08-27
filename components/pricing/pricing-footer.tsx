"use client"

import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"

interface PricingFooterProps {
  onUpgrade: (planName: string) => void
}

export function PricingFooter({ onUpgrade }: PricingFooterProps) {
  return (
    <>
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-lg z-50 md:hidden">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <span className="text-xs md:text-sm font-medium">Ready to grow faster?</span>
            <div className="flex gap-2">
              <Button
                size="sm"
                className="bg-[#21C087] hover:bg-[#21C087]/90 text-white text-xs px-3"
                onClick={() => onUpgrade("Venturo Pro")}
              >
                Upgrade to Pro
              </Button>
              <Button
                size="sm"
                variant="outline"
                className="text-xs px-3 bg-transparent"
                onClick={() => onUpgrade("Investor Premium")}
              >
                Premium
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Legal Footer */}
      <div className="bg-muted py-6 md:py-8 mb-16 md:mb-0">
        <div className="container mx-auto px-4 text-center">
          <p className="text-xs md:text-sm text-muted-foreground max-w-4xl mx-auto">
            Venturo is a networking/showcase platform. We do not arrange or execute investments, hold client funds, or
            provide financial/legal advice. For investment activity, seek independent advice. All deals occur privately
            between users.
          </p>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-foreground text-white py-8 md:py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
            <div className="col-span-2 md:col-span-1">
              <Link href="/">
                <Image
                  src="/venturo-logo-full.png"
                  alt="Venturo"
                  width={140}
                  height={48}
                  className="h-8 md:h-10 w-auto mb-4 brightness-0 invert"
                />
              </Link>
              <p className="text-white/80 text-sm">Co-own the future. Find your collaborators.</p>
            </div>
            <div>
              <h4 className="font-semibold mb-3 md:mb-4 text-sm md:text-base">Platform</h4>
              <ul className="space-y-1 md:space-y-2 text-white/80 text-xs md:text-sm">
                <li>
                  <Link href="/#how-it-works" className="hover:text-accent transition-colors">
                    How it Works
                  </Link>
                </li>
                <li>
                  <Link href="/#why-venturo" className="hover:text-accent transition-colors">
                    For Founders
                  </Link>
                </li>
                <li>
                  <Link href="/#startups" className="hover:text-accent transition-colors">
                    Browse Ideas
                  </Link>
                </li>
                <li>
                  <Link href="/pricing" className="hover:text-accent transition-colors">
                    Pricing
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-3 md:mb-4 text-sm md:text-base">Company</h4>
              <ul className="space-y-1 md:space-y-2 text-white/80 text-xs md:text-sm">
                <li>
                  <a href="#" className="hover:text-accent transition-colors">
                    About
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-accent transition-colors">
                    Legal
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-accent transition-colors">
                    Contact
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-3 md:mb-4 text-sm md:text-base">Connect</h4>
              <ul className="space-y-1 md:space-y-2 text-white/80 text-xs md:text-sm">
                <li>
                  <a href="#" className="hover:text-accent transition-colors">
                    LinkedIn
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-accent transition-colors">
                    Twitter
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-accent transition-colors">
                    Instagram
                  </a>
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t border-white/20 mt-6 md:mt-8 pt-6 md:pt-8 text-center text-white/60 text-xs md:text-sm">
            <p>
              © 2025 Venturo. Venturo is a networking platform only. We do not facilitate investments or hold an AFSL.
            </p>
          </div>
        </div>
      </footer>
    </>
  )
}
