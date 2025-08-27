"use client"

import type React from "react"

import { useState } from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/hooks/use-toast"
import { loadStripe } from '@stripe/stripe-js'

interface UpgradeModalsProps {
  showUpgradeModal: boolean
  setShowUpgradeModal: (show: boolean) => void
  showBoostModal: boolean
  setShowBoostModal: (show: boolean) => void
  selectedPlan: string
  isYearly?: boolean
}

export function UpgradeModals({
  showUpgradeModal,
  setShowUpgradeModal,
  showBoostModal,
  setShowBoostModal,
  selectedPlan,
  isYearly = false,
}: UpgradeModalsProps) {
  const [loading, setLoading] = useState(false)
  const [boostQuantity, setBoostQuantity] = useState(1)
  const [ideaId, setIdeaId] = useState("")
  const { toast } = useToast()

  const handleSubscriptionCheckout = async () => {
    setLoading(true)
    try {
      const response = await fetch('/api/create-checkout-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          plan: selectedPlan,
          isYearly,
        }),
      })

      const { sessionId, error } = await response.json()

      if (error) {
        throw new Error(error)
      }

      // Redirect to Stripe Checkout
      const stripe = await loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!)
      if (stripe) {
        const { error } = await stripe.redirectToCheckout({ sessionId })
        if (error) {
          throw error
        }
      }
    } catch (error) {
      console.error('Checkout error:', error)
      toast({
        title: "Payment Error",
        description: "Failed to start checkout. Please try again.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleBoostCheckout = async () => {
    setLoading(true)
    try {
      const response = await fetch('/api/create-checkout-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          boostQuantity,
          ideaId,
        }),
      })

      const { sessionId, error } = await response.json()

      if (error) {
        throw new Error(error)
      }

      // Redirect to Stripe Checkout
      const stripe = await loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!)
      if (stripe) {
        const { error } = await stripe.redirectToCheckout({ sessionId })
        if (error) {
          throw error
        }
      }
    } catch (error) {
      console.error('Checkout error:', error)
      toast({
        title: "Payment Error",
        description: "Failed to start checkout. Please try again.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      {/* Upgrade Modal */}
      <Dialog
        open={showUpgradeModal}
        onOpenChange={(open) => {
          setShowUpgradeModal(open)
        }}
      >
        <DialogContent className="sm:max-w-md mx-4 max-w-[calc(100vw-2rem)]">
          <DialogHeader>
            <DialogTitle className="text-lg md:text-xl">Upgrade to {selectedPlan}</DialogTitle>
            <DialogDescription className="text-sm md:text-base">
              Choose your billing cycle and complete your payment securely with Stripe.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="bg-muted p-4 rounded-lg">
              <div className="flex justify-between items-center mb-2">
                <span className="font-medium">Plan:</span>
                <span className="text-[#21C087] font-semibold">{selectedPlan}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="font-medium">Price:</span>
                <span className="font-semibold">
                  ${isYearly ? (selectedPlan === 'Venturo Pro' ? '21' : '67') : (selectedPlan === 'Venturo Pro' ? '25' : '80')}/month
                </span>
              </div>
              {isYearly && (
                <div className="text-sm text-muted-foreground mt-1">
                  Save 2 months with yearly billing
                </div>
              )}
            </div>
            
            <Button 
              onClick={handleSubscriptionCheckout}
              disabled={loading}
              className="w-full bg-[#21C087] hover:bg-[#21C087]/90 text-white"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Processing...
                </>
              ) : (
                `Pay ${isYearly ? (selectedPlan === 'Venturo Pro' ? '$250' : '$800') : (selectedPlan === 'Venturo Pro' ? '$25' : '$80')}`
              )}
            </Button>
            
            <p className="text-xs text-muted-foreground text-center">
              You'll be redirected to Stripe to complete your payment securely.
            </p>
          </div>
        </DialogContent>
      </Dialog>

      {/* Boost Modal */}
      <Dialog
        open={showBoostModal}
        onOpenChange={(open) => {
          setShowBoostModal(open)
        }}
      >
        <DialogContent className="sm:max-w-md mx-4 max-w-[calc(100vw-2rem)]">
          <DialogHeader>
            <DialogTitle className="text-lg md:text-xl">Buy a Boost</DialogTitle>
            <DialogDescription className="text-sm md:text-base">
              Get priority placement for your listing across the platform.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="boost-quantity" className="text-sm md:text-base">
                Number of Boosts
              </Label>
              <Select value={boostQuantity.toString()} onValueChange={(value) => setBoostQuantity(parseInt(value))}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">1 Boost - $30</SelectItem>
                  <SelectItem value="4">4 Boosts - $100 (Save $20)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="bg-muted p-4 rounded-lg">
              <div className="flex justify-between items-center mb-2">
                <span className="font-medium">Quantity:</span>
                <span className="text-[#21C087] font-semibold">{boostQuantity} Boost{boostQuantity > 1 ? 's' : ''}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="font-medium">Price:</span>
                <span className="font-semibold">
                  ${boostQuantity === 4 ? '100' : '30'}
                </span>
              </div>
              <div className="text-sm text-muted-foreground mt-1">
                Each boost lasts 7 days
              </div>
            </div>
            
            <Button 
              onClick={handleBoostCheckout}
              disabled={loading}
              className="w-full bg-[#F5B800] hover:bg-[#F5B800]/90 text-black"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-black mr-2"></div>
                  Processing...
                </>
              ) : (
                `Pay $${boostQuantity === 4 ? '100' : '30'}`
              )}
            </Button>
            
            <p className="text-xs text-muted-foreground text-center">
              You'll be redirected to Stripe to complete your payment securely.
            </p>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}
