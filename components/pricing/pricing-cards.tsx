"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Check, Zap } from "lucide-react"

interface PricingCardsProps {
  isYearly: boolean
  onUpgrade: (planName: string) => void
  onBoost: () => void
}

export function PricingCards({ isYearly, onUpgrade, onBoost }: PricingCardsProps) {
  const [loading, setLoading] = useState<string | null>(null)

  async function goToCheckout(priceId: string, planName: string) {
    setLoading(planName)
    try {
      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ priceId }),
      });
      const { url, error } = await res.json();
      if (error) {
        alert(error);
      } else {
        window.location.href = url;
      }
    } catch (error) {
      alert('Failed to start checkout. Please try again.');
    } finally {
      setLoading(null)
    }
  }

  async function goToBoostCheckout(priceId: string, boostType: string) {
    setLoading(boostType)
    try {
      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          priceId,
          mode: 'payment',
          ideaId: 'boost' // This will be replaced with actual idea ID when implemented
        }),
      });
      const { url, error } = await res.json();
      if (error) {
        alert(error);
      } else {
        window.location.href = url;
      }
    } catch (error) {
      alert('Failed to start boost checkout. Please try again.');
    } finally {
      setLoading(null)
    }
  }

  return (
    <section className="py-12 sm:py-16 md:py-20 relative">
      <div className="container mx-auto px-4">
        <div className="grid gap-6 md:gap-8 max-w-6xl mx-auto grid-cols-1 md:grid-cols-3">
          {/* Free Plan */}
          <Card className="border-2 hover:border-primary/20 transition-colors">
            <CardHeader className="text-center pb-6 md:pb-8">
              <CardTitle className="font-serif text-xl md:text-2xl mb-2">Free</CardTitle>
              <div className="mb-4">
                <span className="text-3xl md:text-4xl font-bold">$0</span>
                <span className="text-muted-foreground text-sm md:text-base">/ month</span>
              </div>
              {isYearly && <div className="text-xs md:text-sm text-muted-foreground">Yearly: $0</div>}
              <Button variant="outline" className="w-full mt-4 bg-transparent" disabled>
                Get started
              </Button>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 md:space-y-3">
                <li className="flex items-start">
                  <Check className="h-4 w-4 text-[#21C087] mr-3 flex-shrink-0 mt-0.5" />
                  <span className="text-xs md:text-sm">1 active listing</span>
                </li>
                <li className="flex items-start">
                  <Check className="h-4 w-4 text-[#21C087] mr-3 flex-shrink-0 mt-0.5" />
                  <span className="text-xs md:text-sm">Basic search & browse</span>
                </li>

                <li className="flex items-start">
                  <Check className="h-4 w-4 text-[#21C087] mr-3 flex-shrink-0 mt-0.5" />
                  <span className="text-xs md:text-sm">Community events RSVP</span>
                </li>
                <li className="flex items-start">
                  <Check className="h-4 w-4 text-[#21C087] mr-3 flex-shrink-0 mt-0.5" />
                  <span className="text-xs md:text-sm">Access to Resources (basic templates)</span>
                </li>
                <li className="flex items-start">
                  <Check className="h-4 w-4 text-[#21C087] mr-3 flex-shrink-0 mt-0.5" />
                  <span className="text-xs md:text-sm">AI Pitch Copilot: 3 credits/month</span>
                </li>
                <li className="flex items-start">
                  <Check className="h-4 w-4 text-[#21C087] mr-3 flex-shrink-0 mt-0.5" />
                  <span className="text-xs md:text-sm">Standard listing position</span>
                </li>
                <li className="flex items-start">
                  <Check className="h-4 w-4 text-[#21C087] mr-3 flex-shrink-0 mt-0.5" />
                  <span className="text-xs md:text-sm">Email support (within 72h)</span>
                </li>
              </ul>
            </CardContent>
          </Card>

          {/* Venturo Pro Plan */}
          <Card className="border-2 border-[#0B1E3C] bg-[#0B1E3C] text-white relative">
            <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
              <Badge className="bg-[#F5B800] text-black font-medium px-3 md:px-4 py-1 text-xs md:text-sm">
                Recommended
              </Badge>
            </div>
            <CardHeader className="text-center pb-6 md:pb-8">
              <CardTitle className="font-serif text-xl md:text-2xl mb-2 text-white">Venturo Pro</CardTitle>
              <div className="mb-4">
                <span className="text-3xl md:text-4xl font-bold">${isYearly ? "21" : "25"}</span>
                <span className="text-white/80 text-sm md:text-base">/ month</span>
              </div>
              {isYearly && <div className="text-xs md:text-sm text-white/60">Yearly: $250 (2 months free)</div>}
              <div className="space-y-2 mt-4">
                <Button
                  className="w-full bg-[#21C087] hover:bg-[#21C087]/90 text-white"
                  onClick={() => goToCheckout('price_pro_monthly', 'Venturo Pro Monthly')}
                  disabled={loading === 'Venturo Pro Monthly'}
                >
                  {loading === 'Venturo Pro Monthly' ? 'Loading...' : 'Upgrade to Pro (Monthly)'}
                </Button>
                <Button
                  variant="outline"
                  className="w-full bg-transparent border-white/20 text-white hover:bg-white/10"
                  onClick={() => goToCheckout('price_pro_yearly', 'Venturo Pro Yearly')}
                  disabled={loading === 'Venturo Pro Yearly'}
                >
                  {loading === 'Venturo Pro Yearly' ? 'Loading...' : 'Upgrade to Pro (Yearly)'}
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 md:space-y-3">
                <li className="flex items-start">
                  <Check className="h-4 w-4 text-[#21C087] mr-3 flex-shrink-0 mt-0.5" />
                  <span className="text-xs md:text-sm text-white">3 active listings</span>
                </li>
                <li className="flex items-start">
                  <Check className="h-4 w-4 text-[#21C087] mr-3 flex-shrink-0 mt-0.5" />
                  <span className="text-xs md:text-sm text-white">Priority exposure in search & feeds</span>
                </li>
                <li className="flex items-start">
                  <Check className="h-4 w-4 text-[#21C087] mr-3 flex-shrink-0 mt-0.5" />
                  <span className="text-xs md:text-sm text-white">Boost discount: 20%</span>
                </li>
                <li className="flex items-start">
                  <Check className="h-4 w-4 text-[#21C087] mr-3 flex-shrink-0 mt-0.5" />
                  <span className="text-xs md:text-sm text-white">Listing analytics (views, saves, CTR)</span>
                </li>
                <li className="flex items-start">
                  <Check className="h-4 w-4 text-[#21C087] mr-3 flex-shrink-0 mt-0.5" />
                  <span className="text-xs md:text-sm text-white">AI Pitch Copilot: 30 credits/month</span>
                </li>
                <li className="flex items-start">
                  <Check className="h-4 w-4 text-[#21C087] mr-3 flex-shrink-0 mt-0.5" />
                  <span className="text-xs md:text-sm text-white">Listing Health Checklist & prompts</span>
                </li>
                <li className="flex items-start">
                  <Check className="h-4 w-4 text-[#21C087] mr-3 flex-shrink-0 mt-0.5" />
                  <span className="text-xs md:text-sm text-white">Custom covers & rich media links</span>
                </li>
                <li className="flex items-start">
                  <Check className="h-4 w-4 text-[#21C087] mr-3 flex-shrink-0 mt-0.5" />
                  <span className="text-xs md:text-sm text-white">Pro badge on profile</span>
                </li>
                <li className="flex items-start">
                  <Check className="h-4 w-4 text-[#21C087] mr-3 flex-shrink-0 mt-0.5" />
                  <span className="text-xs md:text-sm text-white">Priority email support (24–48h)</span>
                </li>
                <li className="flex items-start">
                  <Check className="h-4 w-4 text-[#21C087] mr-3 flex-shrink-0 mt-0.5" />
                  <span className="text-xs md:text-sm text-white">Early access to select community events</span>
                </li>
              </ul>
            </CardContent>
          </Card>

          {/* Investor Premium Plan */}
          <Card className="border-2 hover:border-primary/20 transition-colors">
            <div className="bg-[#0B1E3C] text-white text-center py-2 rounded-t-lg">
              <span className="font-medium text-xs md:text-sm">Investor Premium</span>
            </div>
            <CardHeader className="text-center pb-6 md:pb-8">
              <CardTitle className="font-serif text-xl md:text-2xl mb-2">Premium</CardTitle>
              <div className="mb-4">
                <span className="text-3xl md:text-4xl font-bold">${isYearly ? "67" : "80"}</span>
                <span className="text-muted-foreground text-sm md:text-base">/ month</span>
              </div>
              {isYearly && <div className="text-xs md:text-sm text-muted-foreground">Yearly: $800 (2 months free)</div>}
              <div className="space-y-2 mt-4">
                <Button
                  className="w-full bg-[#21C087] hover:bg-[#21C087]/90 text-white"
                  onClick={() => goToCheckout('price_prem_monthly', 'Premium Monthly')}
                  disabled={loading === 'Premium Monthly'}
                >
                  {loading === 'Premium Monthly' ? 'Loading...' : 'Upgrade to Premium (Monthly)'}
                </Button>
                <Button
                  variant="outline"
                  className="w-full bg-transparent border-[#21C087] text-[#21C087] hover:bg-[#21C087]/10"
                  onClick={() => goToCheckout('price_prem_yearly', 'Premium Yearly')}
                  disabled={loading === 'Premium Yearly'}
                >
                  {loading === 'Premium Yearly' ? 'Loading...' : 'Upgrade to Premium (Yearly)'}
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 md:space-y-3">
                <li className="flex items-start">
                  <Check className="h-4 w-4 text-[#21C087] mr-3 flex-shrink-0 mt-0.5" />
                  <span className="text-xs md:text-sm">Unlimited active listings</span>
                </li>
                <li className="flex items-start">
                  <Check className="h-4 w-4 text-[#21C087] mr-3 flex-shrink-0 mt-0.5" />
                  <span className="text-xs md:text-sm">Early access feed to top startups</span>
                </li>
                <li className="flex items-start">
                  <Check className="h-4 w-4 text-[#21C087] mr-3 flex-shrink-0 mt-0.5" />
                  <span className="text-xs md:text-sm">Advanced filters (sector, traction, stage)</span>
                </li>
                <li className="flex items-start">
                  <Check className="h-4 w-4 text-[#21C087] mr-3 flex-shrink-0 mt-0.5" />
                  <span className="text-xs md:text-sm">5 intro credits/month (warm intros)</span>
                </li>
                <li className="flex items-start">
                  <Check className="h-4 w-4 text-[#21C087] mr-3 flex-shrink-0 mt-0.5" />
                  <span className="text-xs md:text-sm">Boost discount: 30%</span>
                </li>
                <li className="flex items-start">
                  <Check className="h-4 w-4 text-[#21C087] mr-3 flex-shrink-0 mt-0.5" />
                  <span className="text-xs md:text-sm">AI Pitch Copilot: 50 credits/month</span>
                </li>
                <li className="flex items-start">
                  <Check className="h-4 w-4 text-[#21C087] mr-3 flex-shrink-0 mt-0.5" />
                  <span className="text-xs md:text-sm">Saved lists & portfolio notes</span>
                </li>
                <li className="flex items-start">
                  <Check className="h-4 w-4 text-[#21C087] mr-3 flex-shrink-0 mt-0.5" />
                  <span className="text-xs md:text-sm">Investor badge on profile</span>
                </li>
                <li className="flex items-start">
                  <Check className="h-4 w-4 text-[#21C087] mr-3 flex-shrink-0 mt-0.5" />
                  <span className="text-xs md:text-sm">Invitations to pitch nights / mixers</span>
                </li>
                <li className="flex items-start">
                  <Check className="h-4 w-4 text-[#21C087] mr-3 flex-shrink-0 mt-0.5" />
                  <span className="text-xs md:text-sm">Priority email support (24–48h)</span>
                </li>
                <li className="flex items-start">
                  <Check className="h-4 w-4 text-[#21C087] mr-3 flex-shrink-0 mt-0.5" />
                  <span className="text-xs md:text-sm">Advisory content: suggested diligence questions</span>
                </li>
              </ul>
            </CardContent>
          </Card>
        </div>

        <div className="max-w-md mx-auto mt-8 md:mt-12 px-4">
          <Card className="border-2 border-[#F5B800]/30 bg-gradient-to-br from-[#F5B800]/5 to-[#F5B800]/10">
            <CardHeader className="text-center">
              <div className="flex items-center justify-center mb-2">
                <Zap className="h-4 md:h-5 w-4 md:w-5 text-[#F5B800] mr-2" />
                <CardTitle className="font-serif text-lg md:text-xl">Boost your listing</CardTitle>
              </div>
              <div className="mb-4">
                <span className="text-2xl md:text-3xl font-bold">$30</span>
                <span className="text-muted-foreground text-sm md:text-base">/ 7 days per listing</span>
              </div>
              <CardDescription className="text-center text-xs md:text-sm px-2">
                Get priority placement across Browse, homepage carousel, and a gold 'Boosted' pill on your card.
              </CardDescription>
            </CardHeader>
            <CardContent className="text-center space-y-3">
              <div className="flex flex-col sm:flex-row gap-2">
                <Button 
                  className="flex-1 bg-[#F5B800] hover:bg-[#F5B800]/90 text-black text-sm" 
                  onClick={() => goToBoostCheckout('prod_SxY9JTQs8iuyOH', 'Boost Single')}
                  disabled={loading === 'Boost Single'}
                >
                  {loading === 'Boost Single' ? 'Loading...' : 'Buy 1 Boost'}
                </Button>
                <Button 
                  variant="outline" 
                  className="flex-1 bg-transparent text-sm" 
                  onClick={() => goToBoostCheckout('prod_SxY9JTQs8iuyOH', 'Boost Pack')}
                  disabled={loading === 'Boost Pack'}
                >
                  {loading === 'Boost Pack' ? 'Loading...' : 'Buy 4 for $100'}
                </Button>
              </div>
              <p className="text-xs text-muted-foreground px-2">Visibility improvements are not guaranteed outcomes.</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  )
}
