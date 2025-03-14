"use client"

import { motion } from "framer-motion"
import Image from "next/image"
import Link from "next/link"

export function AppDownloadSection() {
  return (
    <section className="py-16 bg-muted">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row items-center justify-between gap-8 bg-white rounded-xl p-8 shadow-lg">
          <div className="md:w-2/3">
            <h2 className="text-2xl md:text-3xl font-bold mb-4">Download the QuickFuel App Today</h2>
            <p className="text-muted-foreground mb-6">
              Available for iOS and Android. Get real-time fuel prices, directions, and easy payments.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link href="#" className="transition-transform hover:scale-105">
                <Image
                  src="https://e7.pngegg.com/pngimages/390/549/png-clipart-apple-app-store-advertisement-iphone-app-store-android-coming-soon-electronics-text.png"
                  alt="Download on App Store"
                  width={200}
                  height={60}
                  className="h-[60px] w-auto"
                />
              </Link>
              <Link href="#" className="transition-transform hover:scale-105">
                <Image
                  src="https://e7.pngegg.com/pngimages/918/845/png-clipart-google-play-logo-google-play-app-store-android-google-play-text-logo.png"
                  alt="Get it on Google Play"
                  width={200}
                  height={60}
                  className="h-[60px] w-auto"
                />
              </Link>
            </div>
          </div>
          <div className="md:w-1/3 flex justify-center">
            <div className="relative h-[200px] w-[200px]">
              <Image
                src="https://blog.tcea.org/wp-content/uploads/2022/05/qrcode_tcea.org-1.png"
                alt="QuickFuel App QR Code"
                fill
                className="object-contain"
              />
              <motion.div
                className="absolute inset-0"
                animate={{
                  boxShadow: ["0 0 0 0 rgba(0,0,0,0)", "0 0 0 10px rgba(0,0,0,0.1)", "0 0 0 0 rgba(0,0,0,0)"],
                }}
                transition={{
                  repeat: Number.POSITIVE_INFINITY,
                  duration: 2,
                }}
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

