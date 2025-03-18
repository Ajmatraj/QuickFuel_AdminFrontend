import { Button } from "@/components/ui/button"
import Link from "next/link"

export default function AboutCTA() {
  return (
    <section className="bg-gradient-to-r from-orange-600 to-red-600 py-12 md:py-24">
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex flex-col items-center justify-center space-y-4 text-center">
          <div className="space-y-2">
            <h2 className="text-3xl font-bold tracking-tighter text-white sm:text-4xl md:text-5xl">
              Join the QuickFuel Revolution
            </h2>
            <p className="max-w-[900px] text-white/90 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
              Experience the convenience of on-demand fuel delivery and never worry about running out of fuel again.
            </p>
          </div>
          <div className="flex flex-col gap-2 min-[400px]:flex-row">
            <Button size="lg" className="bg-white text-red-600 hover:bg-gray-100">
              Download App
            </Button>
            <Link href="/careers">
              <Button size="lg" variant="outline" className="text-white border-white hover:bg-white/10">
                Join Our Team
              </Button>
            </Link>
          </div>
          <div className="mt-6 flex items-center justify-center gap-8">
            <a href="#" className="inline-block">
              <img src="/placeholder.svg?height=50&width=150" alt="Download on App Store" className="h-12" />
            </a>
            <a href="#" className="inline-block">
              <img src="/placeholder.svg?height=50&width=170" alt="Get it on Google Play" className="h-12" />
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}

