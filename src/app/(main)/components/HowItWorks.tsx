import Image from "next/image"
import { ArrowRight } from "lucide-react"

export default function HowItWorks() {
  return (
    <section className="w-full py-12 md:py-24 bg-white">
      <div className="container px-4 md:px-6">
        <div className="flex flex-col items-center justify-center space-y-4 text-center">
          <div className="space-y-2">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">How QuickFuel Works</h2>
            <p className="max-w-[900px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
              Get started with QuickFuel in just a few simple steps and transform your refueling experience.
            </p>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16">
          <div className="flex flex-col items-center text-center space-y-4 relative">
            <div className="relative">
              <div className="w-20 h-20 rounded-full bg-green-600 flex items-center justify-center text-white text-2xl font-bold">
                1
              </div>
              <div className="absolute -top-2 -right-2 w-6 h-6 bg-yellow-400 rounded-full animate-ping opacity-75"></div>
            </div>
            <h3 className="text-xl font-bold">Download & Register</h3>
            <p className="text-gray-500">
              Download the QuickFuel app from the App Store or Google Play and create your account in minutes.
            </p>
            <div className="hidden md:block absolute top-10 right-0 transform translate-x-1/2">
              <ArrowRight className="h-8 w-8 text-green-600" />
            </div>
          </div>
          <div className="flex flex-col items-center text-center space-y-4 relative">
            <div className="relative">
              <div className="w-20 h-20 rounded-full bg-green-600 flex items-center justify-center text-white text-2xl font-bold">
                2
              </div>
              <div className="absolute -top-2 -right-2 w-6 h-6 bg-green-400 rounded-full animate-ping opacity-75"></div>
            </div>
            <h3 className="text-xl font-bold">Find & Select Station</h3>
            <p className="text-gray-500">
              Browse nearby stations, compare prices, and select the one that best meets your needs.
            </p>
            <div className="hidden md:block absolute top-10 right-0 transform translate-x-1/2">
              <ArrowRight className="h-8 w-8 text-green-600" />
            </div>
          </div>
          <div className="flex flex-col items-center text-center space-y-4">
            <div className="relative">
              <div className="w-20 h-20 rounded-full bg-green-600 flex items-center justify-center text-white text-2xl font-bold">
                3
              </div>
              <div className="absolute -top-2 -right-2 w-6 h-6 bg-green-400 rounded-full animate-ping opacity-75"></div>
            </div>
            <h3 className="text-xl font-bold">Pay & Refuel</h3>
            <p className="text-gray-500">
              Pay securely through the app, drive to the pump, and refuel your vehicle without any hassle.
            </p>
          </div>
        </div>
        <div className="mt-16 relative overflow-hidden rounded-xl border shadow-xl">
          <div className="absolute inset-0 bg-gradient-to-r from-green-500/20 to-purple-500/20 animate-gradient"></div>
          <Image
            src="https://www.peppyocean.com/wp-content/uploads/2023/06/cost-to-develop-fuel-delivery-app.png"
            alt="QuickFuel App Interface"
            width={1200}
            height={400}
            className="w-full h-screen object-fill"
          />
        </div>
      </div>
    </section>
  )
}

