"use client"

import Image from "next/image"
import { CreditCard, Fuel, Navigation, Star, ArrowRight } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Carousel, CarouselContent, CarouselItem, CarouselPrevious, CarouselNext } from "@/components/ui/carousel"

export function FeaturesCarouselSection() {
  return (
    <section className="py-20 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <Badge className="mb-4">App Features</Badge>
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Why Choose QuickFuel</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Our app is packed with features to make finding and purchasing fuel as easy as possible.
          </p>
        </div>

        <Carousel className="w-full max-w-5xl mx-auto">
          <CarouselContent>
            {[
              {
                title: "Real-Time Pricing",
                description: "Get up-to-date fuel prices for all stations in your area.",
                icon: <CreditCard className="h-12 w-12 text-primary" />,
                image: "/placeholder.svg?height=400&width=600",
              },
              {
                title: "Fuel Type Filtering",
                description: "Find stations that offer the specific fuel type your vehicle needs.",
                icon: <Fuel className="h-12 w-12 text-primary" />,
                image: "/placeholder.svg?height=400&width=600",
              },
              {
                title: "Route Planning",
                description: "Plan your journey with fuel stops along the way.",
                icon: <Navigation className="h-12 w-12 text-primary" />,
                image: "/placeholder.svg?height=400&width=600",
              },
              {
                title: "Loyalty Rewards",
                description: "Earn points with every purchase and redeem for discounts.",
                icon: <Star className="h-12 w-12 text-primary" />,
                image: "/placeholder.svg?height=400&width=600",
              },
            ].map((feature, index) => (
              <CarouselItem key={index} className="md:basis-1/2 lg:basis-1/1">
                <Card className="border-none shadow-lg overflow-hidden h-full">
                  <div className="relative h-48">
                    <Image
                      src={feature.image || "/placeholder.svg"}
                      alt={feature.title}
                      fill
                      className="object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                    <div className="absolute bottom-4 left-4 text-white">
                      <h3 className="text-xl font-bold">{feature.title}</h3>
                    </div>
                  </div>
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      <div className="mt-1">{feature.icon}</div>
                      <div>
                        <p className="text-muted-foreground mb-4">{feature.description}</p>
                        <Button variant="link" className="p-0 h-auto flex items-center gap-1">
                          Learn more <ArrowRight className="h-4 w-4 ml-1" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </CarouselItem>
            ))}
          </CarouselContent>
          <div className="flex justify-center mt-8 gap-2">
            <CarouselPrevious />
            <CarouselNext />
          </div>
        </Carousel>
      </div>
    </section>
  )
}

