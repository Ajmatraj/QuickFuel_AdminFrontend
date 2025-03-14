"use client"

import { motion } from "framer-motion"
import Image from "next/image"
import { ChevronRight, Download } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"

export function HeroSection() {
  return (
    <section className="relative bg-gradient-to-r from-primary/90 to-primary overflow-hidden">
      <div className="absolute inset-0 bg-grid-white/5 [mask-image:linear-gradient(0deg,rgba(255,255,255,0.1),rgba(255,255,255,0.5))]"></div>
      <div className="container mx-auto px-4 py-20 relative z-10">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-12">
          <motion.div
            className="lg:w-1/2 text-white"
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Badge className="mb-4 bg-white/20 text-white hover:bg-white/30">New Release</Badge>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
              Find and Purchase Fuel Faster with QuickFuel
            </h1>
            <p className="text-lg md:text-xl opacity-90 mb-8">
              Locate nearby fuel stations, check prices, and make payments all from your smartphone. Save time and never
              worry about finding fuel again.
            </p>
            <div className="flex flex-wrap gap-4">
              <Button size="lg" className="bg-white text-primary hover:bg-white/90">
                <Download className="mr-2 h-5 w-5" />
                Download App
              </Button>
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10">
                Learn More
                <ChevronRight className="ml-2 h-5 w-5" />
              </Button>
            </div>
            <div className="flex items-center gap-4 mt-8">
              <div className="flex -space-x-2">
                {[1, 2, 3, 4].map((i) => (
                  <div
                    key={i}
                    className="h-10 w-10 rounded-full border-2 border-primary bg-white flex items-center justify-center text-primary font-bold"
                  >
                    {i}
                  </div>
                ))}
              </div>
              <p className="text-sm opacity-90">
                Join <span className="font-bold">10,000+</span> users finding fuel easily
              </p>
            </div>
          </motion.div>
          <motion.div
            className="lg:w-1/2 relative"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <div className="relative h-[500px] w-[250px] mx-auto">
              <div className="absolute inset-0 bg-black rounded-[40px] shadow-2xl overflow-hidden border-8 border-gray-800">
                <div className="absolute top-0 left-0 right-0 h-6 bg-black z-10 flex justify-center">
                  <div className="w-20 h-4 bg-black rounded-b-xl"></div>
                </div>
                <Image
                  src="https://blog.tcea.org/wp-content/uploads/2022/05/qrcode_tcea.org-1.png"
                  alt="QuickFuel App"
                  fill
                  className="object-cover rounded-[32px]"
                />
              </div>
              <div className="absolute -right-16 -top-16 h-40 w-40 bg-yellow-400 rounded-full blur-3xl opacity-30"></div>
              <div className="absolute -left-16 -bottom-16 h-40 w-40 bg-blue-400 rounded-full blur-3xl opacity-30"></div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}

