"use client"

import { useState, useEffect } from "react"
import { Star } from "lucide-react"

import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel"
import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

const testimonials = [
  {
    id: 1,
    name: "Sarah Johnson",
    role: "Daily Commuter",
    avatar: "/placeholder.svg?height=80&width=80",
    content:
      "QuickFuel has completely changed how I refuel my car. I save at least 10 minutes every time I need gas, and the price comparison feature has saved me a lot of money over time.",
    rating: 5,
  },
  {
    id: 2,
    name: "Michael Chen",
    role: "Rideshare Driver",
    avatar: "/placeholder.svg?height=80&width=80",
    content:
      "As a full-time Uber driver, I need to refuel multiple times a day. QuickFuel helps me find the cheapest stations quickly, and the mobile payment feature is a game-changer.",
    rating: 5,
  },
  {
    id: 3,
    name: "Emily Rodriguez",
    role: "Road Trip Enthusiast",
    avatar: "/placeholder.svg?height=80&width=80",
    content:
      "I love taking road trips, and QuickFuel has become an essential app for my journeys. It helps me plan my refueling stops efficiently and find stations with the amenities I need.",
    rating: 4,
  },
  {
    id: 4,
    name: "David Thompson",
    role: "Business Owner",
    avatar: "/placeholder.svg?height=80&width=80",
    content:
      "Managing a fleet of delivery vehicles was a hassle until we started using QuickFuel. Now we can track all fuel expenses in one place and ensure our drivers are getting the best prices.",
    rating: 5,
  },
  {
    id: 5,
    name: "Lisa Patel",
    role: "Suburban Parent",
    avatar: "/placeholder.svg?height=80&width=80",
    content:
      "With three kids and a busy schedule, I don't have time to shop around for gas prices. QuickFuel does that for me, and I love the contactless payment option - especially during cold winter months!",
    rating: 4,
  },
]

export default function TestimonialCarousel() {
  const [api, setApi] = useState<any>()
  const [current, setCurrent] = useState(0)
  const [count, setCount] = useState(0)

  useEffect(() => {
    if (!api) {
      return
    }

    setCount(api.scrollSnapList().length)
    setCurrent(api.selectedScrollSnap())

    api.on("select", () => {
      setCurrent(api.selectedScrollSnap())
    })
  }, [api])

  return (
    <section className="w-full py-12 md:py-24 bg-white">
      <div className="container px-4 md:px-6">
        <div className="flex flex-col items-center justify-center space-y-4 text-center">
          <div className="space-y-2">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">What Our Users Say</h2>
            <p className="max-w-[900px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
              Join thousands of satisfied drivers who have transformed their refueling experience with QuickFuel.
            </p>
          </div>
        </div>

        <div className="mt-12">
          <Carousel setApi={setApi} className="w-full max-w-5xl mx-auto">
            <CarouselContent>
              {testimonials.map((testimonial) => (
                <CarouselItem key={testimonial.id} className="md:basis-1/2 lg:basis-1/3 p-2">
                  <Card className="h-full border shadow-sm transition-all duration-200 hover:shadow-md">
                    <CardContent className="p-6 flex flex-col h-full">
                      <div className="flex items-center gap-4 mb-4">
                        <Avatar>
                          <AvatarImage src={testimonial.avatar} alt={testimonial.name} />
                          <AvatarFallback>{testimonial.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium">{testimonial.name}</p>
                          <p className="text-sm text-gray-500">{testimonial.role}</p>
                        </div>
                      </div>
                      <div className="flex mb-4">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`h-4 w-4 ${i < testimonial.rating ? "fill-yellow-500 text-yellow-500" : "fill-gray-200 text-gray-200"}`}
                          />
                        ))}
                      </div>
                      <p className="text-gray-600 flex-grow">{testimonial.content}</p>
                    </CardContent>
                  </Card>
                </CarouselItem>
              ))}
            </CarouselContent>
            <div className="flex items-center justify-center mt-4 gap-2">
              <CarouselPrevious className="relative static transform-none" />
              <div className="flex items-center gap-1">
                {[...Array(count)].map((_, i) => (
                  <div key={i} className={`h-2 w-2 rounded-full ${current === i ? "bg-blue-600" : "bg-gray-300"}`} />
                ))}
              </div>
              <CarouselNext className="relative static transform-none" />
            </div>
          </Carousel>
        </div>
      </div>
    </section>
  )
}

