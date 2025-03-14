import { Button } from '@/components/ui/button'
import { Download } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import React from 'react'

const HeroSection = () => {
  return (
    <>
      <section className="w-full py-12 md:py-24 lg:py-32 bg-gradient-to-r from-blue-600 to-blue-800 text-white">
        <div className="container px-4 md:px-6 space-y-10 xl:space-y-16">
          <div className="grid gap-6 lg:grid-cols-2 lg:gap-12 items-center">
            <div className="space-y-4">
              <div className="inline-block rounded-lg bg-blue-500/20 px-3 py-1 text-sm">Download Now</div>
              <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl xl:text-6xl/none">
                QuickFuel: Refuel Smarter, Drive Further
              </h1>
              <p className="max-w-[600px] text-gray-200 md:text-xl">
                Find the nearest fuel stations, compare prices, and pay directly from your phone. QuickFuel makes
                refueling your vehicle faster and more convenient than ever.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link href="#download">
                  <Button size="lg" 
                  className="bg-white text-blue-700 hover:bg-gray-100">
                    <Download className="mr-2 h-5 w-5" />
                    App Store
                  </Button>
                </Link>
                <Link href="#download">
                  <Button size="lg" variant="outline" 
                  className="bg-white text-blue-700 hover:bg-gray-100">
                    <Download className="mr-2 h-5 w-5" />
                    Google Play
                  </Button>
                </Link>
              </div>
            </div>
            <div className="flex justify-center lg:justify-end relative">
              <div className="relative w-[280px] h-[560px] sm:w-[320px] sm:h-[640px] rounded-[40px] border-[8px] border-gray-800 bg-gray-800 shadow-xl overflow-hidden">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/3 h-6 bg-gray-800 rounded-b-xl"></div>
                <Image
                  src="https://appscrip.com/wp-content/uploads/2021/03/6-1-507x1024.png"
                  alt="QuickFuel App Screenshot"
                  width={320}
                  height={640}
                  className="w-full h-full object-cover rounded-[32px]"
                />
              </div>
              <div className="absolute -bottom-6 -left-6 w-24 h-24 bg-yellow-400 rounded-full animate-pulse opacity-70"></div>
              <div className="absolute -top-6 -right-6 w-32 h-32 bg-blue-400 rounded-full animate-pulse opacity-70"></div>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}

export default HeroSection
