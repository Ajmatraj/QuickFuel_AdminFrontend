"use client"

import { Smartphone, Check } from "lucide-react"
import { Button } from "@/components/ui/button"

export function CTASection() {
  return (
    <section className="py-20 bg-primary text-white">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to Simplify Your Fuel Experience?</h2>
          <p className="text-xl opacity-90 mb-8">
            Download the QuickFuel app today and join thousands of satisfied users who never worry about finding fuel
            again.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Button size="lg" className="bg-white text-primary hover:bg-white/90">
              <Smartphone className="mr-2 h-5 w-5" />
              Download Now
            </Button>
            <Button size="lg" variant="outline" className="border-white hover:bg-white/10">
              Learn More
            </Button>
          </div>
          <div className="mt-12 flex flex-wrap justify-center gap-6">
            {["Real-time prices", "Easy navigation", "Secure payments", "Loyalty rewards", "24/7 support"].map(
              (feature, index) => (
                <div key={index} className="flex items-center gap-2">
                  <Check className="h-5 w-5" />
                  <span>{feature}</span>
                </div>
              ),
            )}
          </div>
        </div>
      </div>
    </section>
  )
}

