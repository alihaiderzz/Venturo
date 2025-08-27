"use client"

import { useState } from "react"
import { PricingHeader } from "@/components/pricing/pricing-header"
import { PricingHero } from "@/components/pricing/pricing-hero"
import { PricingCards } from "@/components/pricing/pricing-cards"
import { ComparisonTable } from "@/components/pricing/comparison-table"
import { PricingFAQ } from "@/components/pricing/pricing-faq"
import { PricingFooter } from "@/components/pricing/pricing-footer"
import { UpgradeModals } from "@/components/pricing/upgrade-modals"

export default function PricingPage() {
  const [isYearly, setIsYearly] = useState(false)
  const [showUpgradeModal, setShowUpgradeModal] = useState(false)
  const [selectedPlan, setSelectedPlan] = useState("")
  const [showBoostModal, setShowBoostModal] = useState(false)

  const handleUpgrade = (planName: string) => {
    setSelectedPlan(planName)
    setShowUpgradeModal(true)
  }

  const handleBoost = () => {
    setShowBoostModal(true)
  }

  return (
    <div className="min-h-screen bg-background">
      <PricingHeader />
      <PricingHero isYearly={isYearly} setIsYearly={setIsYearly} />
      <PricingCards isYearly={isYearly} onUpgrade={handleUpgrade} onBoost={handleBoost} />
      <ComparisonTable />
      <PricingFAQ />
      <PricingFooter onUpgrade={handleUpgrade} />

      <UpgradeModals
        showUpgradeModal={showUpgradeModal}
        setShowUpgradeModal={setShowUpgradeModal}
        showBoostModal={showBoostModal}
        setShowBoostModal={setShowBoostModal}
        selectedPlan={selectedPlan}
        isYearly={isYearly}
      />
    </div>
  )
}
