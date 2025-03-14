"use client"

import { motion } from "framer-motion"
import { Search, Navigation, CreditCard, Fuel } from "lucide-react"
import { Badge } from "@/components/ui/badge"

export function HowItWorksSection() {
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  }

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 },
  }

  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <Badge className="mb-4">Simple Process</Badge>
          <h2 className="text-3xl md:text-4xl font-bold mb-4">How QuickFuel Works</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Find, navigate to, and pay for fuel in just a few taps. QuickFuel makes refueling your vehicle faster and
            more convenient than ever.
          </p>
        </div>

        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.3 }}
        >
          {[
            {
              icon: <Search className="h-10 w-10 text-primary" />,
              title: "Find Stations",
              description: "Locate nearby fuel stations with real-time availability and pricing information.",
            },
            {
              icon: <Navigation className="h-10 w-10 text-primary" />,
              title: "Get Directions",
              description: "Get turn-by-turn directions to your chosen fuel station.",
            },
            {
              icon: <CreditCard className="h-10 w-10 text-primary" />,
              title: "Easy Payment",
              description: "Pay securely through the app for a contactless experience.",
            },
            {
              icon: <Fuel className="h-10 w-10 text-primary" />,
              title: "Fuel Up",
              description: "Show your receipt at the station and fill up your tank.",
            },
          ].map((step, index) => (
            <motion.div key={index} className="bg-muted/50 rounded-lg p-6 relative" variants={item}>
              <div className="absolute -top-4 -left-4 h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-xl">
                {index + 1}
              </div>
              <div className="mb-4">{step.icon}</div>
              <h3 className="text-xl font-bold mb-2">{step.title}</h3>
              <p className="text-muted-foreground">{step.description}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}

