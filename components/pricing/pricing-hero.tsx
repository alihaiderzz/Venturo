"use client"

import Image from "next/image"
import { Badge } from "@/components/ui/badge"

interface PricingHeroProps {
  isYearly: boolean
  setIsYearly: (value: boolean) => void
}

export function PricingHero({ isYearly, setIsYearly }: PricingHeroProps) {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 py-16 md:py-20">
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 opacity-5">
        <Image src="/venturo-logo-mark.png" alt="" width={400} height={400} className="w-auto h-40 md:h-60" />
      </div>
      <div className="absolute top-10 md:top-20 right-10 md:right-20 opacity-10 animate-pulse">
        <Image src="/venturo-logo-mark.png" alt="" width={80} height={80} className="w-12 h-12 md:w-16 md:h-16" />
      </div>

      <div className="relative container mx-auto px-4 text-center">
        <h1 className="font-serif text-3xl md:text-5xl lg:text-6xl font-bold mb-4 md:mb-6 text-foreground">
          Simple, transparent pricing.
        </h1>
        <p className="text-lg md:text-xl lg:text-2xl mb-6 md:mb-8 text-muted-foreground max-w-3xl mx-auto px-4">
          Venturo is a networking & showcase platform for young Aussie founders. No payments or equity are handled
          on-platform.
        </p>

        <div className="flex items-center justify-center mb-4">
          <span
            className={`mr-3 text-sm md:text-base ${!isYearly ? "text-foreground font-medium" : "text-muted-foreground"}`}
          >
            Monthly
          </span>
          <button
            onClick={() => setIsYearly(!isYearly)}
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
              isYearly ? "bg-primary" : "bg-gray-300"
            }`}
          >
            <span
              className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                isYearly ? "translate-x-6" : "translate-x-1"
              }`}
            />
          </button>
          <span
            className={`ml-3 text-sm md:text-base ${isYearly ? "text-foreground font-medium" : "text-muted-foreground"}`}
          >
            Yearly
            <Badge className="ml-2 bg-[#F5B800] text-black text-xs">2 months free</Badge>
          </span>
        </div>

        <p className="text-xs md:text-sm text-muted-foreground mb-8 md:mb-12 px-4">
          Venturo is not a financial services provider. All deals occur privately between users.
        </p>
      </div>
    </section>
  )
}
