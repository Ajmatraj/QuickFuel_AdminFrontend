"use client"

import AllFuelStationsSection from "./components/AllFuelStationsSection"
import { AppDownloadSection } from "./components/AppDownloadSection"
import { CTASection } from "./components/CTASection"
import { FeaturedStationsSection } from "./components/FeaturedStationsSection"
import { FeaturesCarouselSection } from "./components/FeaturesCarouselSection"
import { HeroSection } from "./components/HeroSection"
import { HowItWorksSection } from "./components/HowItWorksSection"

export default function HomePage() {
  return (
    <div className="min-h-screen">
      <HeroSection />
      <AppDownloadSection />
      <HowItWorksSection />
      <FeaturesCarouselSection />
      <FeaturedStationsSection />
      <AllFuelStationsSection />
      <CTASection />
    </div>
  )
}

