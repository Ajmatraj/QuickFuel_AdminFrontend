import { Fuel, CreditCard, MapPin, Bell, Clock, BarChart } from "lucide-react"

export default function AppFeatures() {
  return (
    <section className="w-full py-12 md:py-24">
      <div className="container px-4 md:px-6">
        <div className="flex flex-col items-center justify-center space-y-4 text-center">
          <div className="space-y-2">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
              Features That Make Refueling Easy
            </h2>
            <p className="max-w-[900px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
              QuickFuel comes packed with features designed to make your refueling experience seamless and efficient.
            </p>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-12">
          <div className="flex flex-col items-center text-center space-y-4 p-6 rounded-lg border bg-white shadow-sm transition-all duration-200 hover:shadow-md hover:-translate-y-1">
            <div className="p-3 rounded-full bg-blue-100 text-blue-600">
              <MapPin className="h-8 w-8" />
            </div>
            <h3 className="text-xl font-bold">Station Finder</h3>
            <p className="text-gray-500">
              Locate the nearest fuel stations with real-time availability and pricing information.
            </p>
          </div>
          <div className="flex flex-col items-center text-center space-y-4 p-6 rounded-lg border bg-white shadow-sm transition-all duration-200 hover:shadow-md hover:-translate-y-1">
            <div className="p-3 rounded-full bg-green-100 text-green-600">
              <Fuel className="h-8 w-8" />
            </div>
            <h3 className="text-xl font-bold">Price Comparison</h3>
            <p className="text-gray-500">
              Compare fuel prices across different stations to find the best deal for your vehicle.
            </p>
          </div>
          <div className="flex flex-col items-center text-center space-y-4 p-6 rounded-lg border bg-white shadow-sm transition-all duration-200 hover:shadow-md hover:-translate-y-1">
            <div className="p-3 rounded-full bg-purple-100 text-purple-600">
              <CreditCard className="h-8 w-8" />
            </div>
            <h3 className="text-xl font-bold">Mobile Payment</h3>
            <p className="text-gray-500">
              Pay for fuel directly from your phone without having to enter the station store.
            </p>
          </div>
          <div className="flex flex-col items-center text-center space-y-4 p-6 rounded-lg border bg-white shadow-sm transition-all duration-200 hover:shadow-md hover:-translate-y-1">
            <div className="p-3 rounded-full bg-yellow-100 text-yellow-600">
              <Bell className="h-8 w-8" />
            </div>
            <h3 className="text-xl font-bold">Price Alerts</h3>
            <p className="text-gray-500">
              Receive notifications when fuel prices drop below your set threshold in your area.
            </p>
          </div>
          <div className="flex flex-col items-center text-center space-y-4 p-6 rounded-lg border bg-white shadow-sm transition-all duration-200 hover:shadow-md hover:-translate-y-1">
            <div className="p-3 rounded-full bg-red-100 text-red-600">
              <Clock className="h-8 w-8" />
            </div>
            <h3 className="text-xl font-bold">Queue Times</h3>
            <p className="text-gray-500">
              View estimated waiting times at stations to plan your refueling stop efficiently.
            </p>
          </div>
          <div className="flex flex-col items-center text-center space-y-4 p-6 rounded-lg border bg-white shadow-sm transition-all duration-200 hover:shadow-md hover:-translate-y-1">
            <div className="p-3 rounded-full bg-teal-100 text-teal-600">
              <BarChart className="h-8 w-8" />
            </div>
            <h3 className="text-xl font-bold">Fuel Tracking</h3>
            <p className="text-gray-500">Track your fuel consumption and expenses over time with detailed analytics.</p>
          </div>
        </div>
      </div>
    </section>
  )
}

