import Image from 'next/image'
import Link from 'next/link'
import React from 'react'

const DownloadSection = () => {
  return (
    <>
    <section id="download" className="w-full py-12 md:py-24 bg-blue-600 text-white">
        <div className="container px-4 md:px-6">
          <div className="grid gap-6 lg:grid-cols-2 lg:gap-12 items-center">
            <div className="space-y-4">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">Download QuickFuel Today</h2>
              <p className="max-w-[600px] text-gray-100 md:text-xl">
                Join thousands of drivers who are saving time and money with QuickFuel. Download the app now and
                experience a smarter way to refuel.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link href="#" className="inline-flex h-14">
                  <Image
                    src="/placeholder.svg?height=56&width=168"
                    alt="Download on App Store"
                    width={168}
                    height={56}
                    className="h-14 w-auto"
                  />
                </Link>
                <Link href="#" className="inline-flex h-14">
                  <Image
                    src="/placeholder.svg?height=56&width=168"
                    alt="Get it on Google Play"
                    width={168}
                    height={56}
                    className="h-14 w-auto"
                  />
                </Link>
              </div>
            </div>
            <div className="flex justify-center lg:justify-end">
              <div className="relative">
                <Image
                  src="https://www.ebizneeds.com/blog/wp-content/uploads/2024/08/fuel-delivery-min.jpg"
                  alt="QuickFuel App on multiple devices"
                  width={600}
                  height={400}
                  className="rounded-lg shadow-xl"
                />
                <div className="absolute -top-4 -right-4 w-20 h-20 bg-yellow-400 rounded-full animate-bounce opacity-70"></div>
                <div className="absolute -bottom-4 -left-4 w-16 h-16 bg-blue-400 rounded-full animate-bounce opacity-70"></div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}

export default DownloadSection