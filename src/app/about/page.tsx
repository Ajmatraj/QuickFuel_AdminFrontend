import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { CheckCircle2, Clock, Fuel, MapPin, Shield, Truck, Users } from "lucide-react"
import AboutCTA from "./components/AboutCTA"
import DownloadSection from "../(main)/components/DownloadSection"

export default function AboutPage() {
  return (
    <main className="flex-1">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-green-600 to-green-600 py-20 md:py-32">
        <div className="container mx-auto px-4 md:px-6">
          <div className="mx-auto max-w-3xl text-center">
            <h1 className="text-3xl font-bold tracking-tighter text-white sm:text-5xl xl:text-6xl/none">
              About QuickFuel
            </h1>
            <p className="mt-4 text-xl text-white/90">Revolutionizing fuel delivery with technology and convenience.</p>
          </div>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-white to-transparent"></div>
      </section>

      {/* Our Story Section */}
      <section className="py-12 md:py-24">
        <div className="container mx-auto px-4 md:px-6">
          <div className="grid gap-6 lg:grid-cols-2 lg:gap-12 items-center">
            <div className="space-y-4">
              <div className="inline-block rounded-lg bg-green-100 px-3 py-1 text-sm text-green-600 font-medium">
                Our Story
              </div>
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">From Idea to Innovation</h2>
              <p className="text-muted-foreground md:text-xl">
                QuickFuel was founded in 2020 with a simple yet powerful idea: what if you never had to worry about
                running out of fuel again?
              </p>
              <p className="text-muted-foreground">
                Our founder, after experiencing the frustration of running out of fuel on a highway during an important
                business trip, realized there had to be a better solution than the traditional roadside assistance model
                that often took hours to respond.
              </p>
              <p className="text-muted-foreground">
                Starting with just three delivery vehicles in one city, QuickFuel has now expanded to serve major
                metropolitan areas across the country, with a fleet of over 100 specialized fuel delivery vehicles and a
                team of certified professionals.
              </p>
            </div>
            <div className="relative h-[400px] lg:h-[500px] rounded-xl overflow-hidden">
              <Image
                src="/placeholder.svg?height=500&width=700"
                alt="QuickFuel founding team"
                fill
                className="object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Mission & Vision Section */}
      <section className="bg-gray-50 py-12 md:py-24">
        <div className="container mx-auto px-4 md:px-6">
          <div className="mx-auto max-w-3xl text-center mb-12">
            <div className="inline-block rounded-lg bg-green-100 px-3 py-1 text-sm text-green-600 font-medium">
              Our Purpose
            </div>
            <h2 className="mt-3 text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">Mission & Vision</h2>
          </div>
          <div className="grid gap-8 md:grid-cols-2">
            <Card className="border-none shadow-lg">
              <CardContent className="p-8">
                <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-green-100">
                  <Fuel className="h-6 w-6 text-green-600" />
                </div>
                <h3 className="text-2xl font-bold mb-4">Our Mission</h3>
                <p className="text-muted-foreground">
                  To provide fast, reliable, and convenient fuel delivery services, wherever and whenever you need it.
                  We aim to eliminate the stress and inconvenience of running out of fuel by bringing the gas station
                  directly to you.
                </p>
                <p className="mt-4 text-muted-foreground">
                  We're committed to exceptional service, transparent pricing, and utilizing technology to make the fuel
                  delivery process as seamless as possible for our customers.
                </p>
              </CardContent>
            </Card>
            <Card className="border-none shadow-lg">
              <CardContent className="p-8">
                <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-green-100">
                  <MapPin className="h-6 w-6 text-green-600" />
                </div>
                <h3 className="text-2xl font-bold mb-4">Our Vision</h3>
                <p className="text-muted-foreground">
                  To revolutionize the way people access fuel and transform roadside assistance by offering seamless,
                  on-demand fuel delivery. We envision a future where no one has to worry about finding a gas station or
                  running out of fuel.
                </p>
                <p className="mt-4 text-muted-foreground">
                  We aim to expand our services nationwide and eventually globally, making QuickFuel synonymous with
                  convenience, reliability, and innovation in the fuel delivery industry.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Core Values Section */}
      <section className="py-12 md:py-24">
        <div className="container mx-auto px-4 md:px-6">
          <div className="mx-auto max-w-3xl text-center mb-12">
            <div className="inline-block rounded-lg bg-green-100 px-3 py-1 text-sm text-green-600 font-medium">
              What We Stand For
            </div>
            <h2 className="mt-3 text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">Our Core Values</h2>
            <p className="mt-4 max-w-[700px] mx-auto text-muted-foreground md:text-xl/relaxed">
              These principles guide everything we do at QuickFuel, from how we develop our technology to how we serve
              our customers.
            </p>
          </div>
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            <Card className="border-none shadow-lg">
              <CardContent className="p-8">
                <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-green-100">
                  <Shield className="h-6 w-6 text-green-600" />
                </div>
                <h3 className="text-xl font-bold mb-2">Reliability</h3>
                <p className="text-muted-foreground">
                  We understand that when you need fuel, you need it now. QuickFuel promises on-time delivery and
                  dependable service, every time. We're there when you need us most.
                </p>
              </CardContent>
            </Card>
            <Card className="border-none shadow-lg">
              <CardContent className="p-8">
                <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-green-100">
                  <Users className="h-6 w-6 text-green-600" />
                </div>
                <h3 className="text-xl font-bold mb-2">Customer-Centric</h3>
                <p className="text-muted-foreground">
                  Your convenience is our top priority. We design our services around your needs and are always striving
                  to improve your experience with QuickFuel.
                </p>
              </CardContent>
            </Card>
            <Card className="border-none shadow-lg">
              <CardContent className="p-8">
                <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-green-100">
                  <Truck className="h-6 w-6 text-green-600" />
                </div>
                <h3 className="text-xl font-bold mb-2">Innovation</h3>
                <p className="text-muted-foreground">
                  We're constantly exploring new ways to make fuel delivery faster, smarter, and more efficient.
                  Technology is at the heart of what we do.
                </p>
              </CardContent>
            </Card>
            <Card className="border-none shadow-lg">
              <CardContent className="p-8">
                <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-green-100">
                  <CheckCircle2 className="h-6 w-6 text-green-600" />
                </div>
                <h3 className="text-xl font-bold mb-2">Quality</h3>
                <p className="text-muted-foreground">
                  We deliver only high-quality fuel that meets or exceeds industry standards. Our delivery vehicles are
                  equipped with certified metering systems to ensure you get exactly what you pay for.
                </p>
              </CardContent>
            </Card>
            <Card className="border-none shadow-lg">
              <CardContent className="p-8">
                <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-green-100">
                  <Clock className="h-6 w-6 text-green-600" />
                </div>
                <h3 className="text-xl font-bold mb-2">Efficiency</h3>
                <p className="text-muted-foreground">
                  We value your time. Our streamlined processes and technology ensure that fuel delivery is as quick and
                  efficient as possible, minimizing wait times.
                </p>
              </CardContent>
            </Card>
            <Card className="border-none shadow-lg">
              <CardContent className="p-8">
                <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-green-100">
                  <Shield className="h-6 w-6 text-green-600" />
                </div>
                <h3 className="text-xl font-bold mb-2">Safety</h3>
                <p className="text-muted-foreground">
                  Safety is paramount in everything we do. Our delivery professionals are trained in safe fuel handling
                  practices, and our vehicles are equipped with the latest safety features.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Team Section */}
    

      {/* Milestones Section */}
      <section className="py-12 md:py-24">
        <div className="container mx-auto px-4 md:px-6">
          <div className="mx-auto max-w-3xl text-center mb-12">
            <div className="inline-block rounded-lg bg-green-100 px-3 py-1 text-sm text-green-600 font-medium">
              Our Journey
            </div>
            <h2 className="mt-3 text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">Key Milestones</h2>
            <p className="mt-4 max-w-[700px] mx-auto text-muted-foreground md:text-xl/relaxed">
              From our humble beginnings to where we are today, these are the moments that have shaped QuickFuel.
            </p>
          </div>
          <div className="relative mx-auto max-w-4xl">
            {/* Timeline line */}
            <div className="absolute left-1/2 top-0 h-full w-0.5 -translate-x-1/2 bg-gray-200"></div>

            {/* Timeline items */}
            <div className="space-y-12">
              {[
                {
                  year: "2020",
                  title: "QuickFuel Founded",
                  description: "Started with 3 delivery vehicles in one city.",
                },
                {
                  year: "2021",
                  title: "Mobile App Launch",
                  description: "Released our first mobile app for iOS and Android.",
                },
                {
                  year: "2021",
                  title: "Expansion to 5 Cities",
                  description: "Expanded operations to five major metropolitan areas.",
                },
                {
                  year: "2022",
                  title: "50,000 Deliveries",
                  description: "Reached the milestone of 50,000 successful fuel deliveries.",
                },
                {
                  year: "2022",
                  title: "Series A Funding",
                  description: "Secugreen $10 million in Series A funding to accelerate growth.",
                },
                {
                  year: "2023",
                  title: "Fleet Expansion",
                  description: "Grew our fleet to over 100 specialized fuel delivery vehicles.",
                },
                {
                  year: "2023",
                  title: "Nationwide Coverage",
                  description: "Expanded to serve customers in 25 states across the country.",
                },
                {
                  year: "2024",
                  title: "1 Million Deliveries",
                  description: "Celebrated our one millionth successful fuel delivery.",
                },
              ].map((milestone, index) => (
                <div
                  key={index}
                  className={`relative flex items-center ${index % 2 === 0 ? "flex-row" : "flex-row-reverse"}`}
                >
                  <div className={`w-1/2 ${index % 2 === 0 ? "pr-8 text-right" : "pl-8"}`}>
                    <div className="space-y-2">
                      <span className="text-sm font-medium text-green-600">{milestone.year}</span>
                      <h3 className="text-xl font-bold">{milestone.title}</h3>
                      <p className="text-muted-foreground">{milestone.description}</p>
                    </div>
                  </div>
                  <div className="absolute left-1/2 -translate-x-1/2 flex h-8 w-8 items-center justify-center rounded-full bg-green-600 text-white">
                    <span className="h-3 w-3 rounded-full bg-white"></span>
                  </div>
                  <div className="w-1/2"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Our Commitment Section */}
      <section className="bg-gray-50 py-12 md:py-24">
        <div className="container mx-auto px-4 md:px-6">
          <div className="grid gap-6 lg:grid-cols-2 lg:gap-12 items-center">
            <div className="relative h-[400px] lg:h-[500px] rounded-xl overflow-hidden">
              <Image
                src="/placeholder.svg?height=500&width=700"
                alt="QuickFuel service in action"
                fill
                className="object-cover"
              />
            </div>
            <div className="space-y-4">
              <div className="inline-block rounded-lg bg-green-100 px-3 py-1 text-sm text-green-600 font-medium">
                Our Commitment
              </div>
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">Dedicated to Excellence</h2>
              <p className="text-muted-foreground md:text-xl">
                At QuickFuel, we're committed to providing exceptional service that goes beyond just delivering fuel.
              </p>
              <ul className="space-y-2">
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                  <span>
                    All our delivery professionals undergo rigorous training in fuel handling and customer service.
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                  <span>We use state-of-the-art technology to ensure accurate fuel measurement and billing.</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                  <span>Our customer support team is available 24/7 to assist with any questions or concerns.</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                  <span>We continuously gather and implement customer feedback to improve our services.</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                  <span>All our vehicles are regularly maintained and equipped with the latest safety features.</span>
                </li>
              </ul>
              <div className="pt-4">
                <Link href="/contact">
                  <Button className="bg-green-600 hover:bg-green-700">Contact Us</Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      {/* <AboutCTA /> */}
      <DownloadSection/>
    </main>
  )
}

