// "use client"

// import { useState, useEffect } from "react"
// import axios from "axios"
// import { motion } from "framer-motion"
// import { Card, CardContent } from "@/components/ui/card"
// import { Badge } from "@/components/ui/badge"
// import { FuelStationCard } from "./FuelStationCard"

// interface FuelType {
//   fuelType: string
//   price: number
//   quantity: number
//   _id?: string
// }

// interface Station {
//   _id: string
//   name: string
//   imageurl: string
//   location: string
//   phone: string
//   email: string
//   stock: string
//   fuelTypes: FuelType[]
//   user: string
//   createdAt: string
//   updatedAt: string
// }

// export function AllFuelStationsCard() {
//   const [stations, setStations] = useState<Station[]>([])
//   const [loading, setLoading] = useState(true)
//   const [error, setError] = useState("")

//   useEffect(() => {
//     const fetchAllStations = async () => {
//       try {
//         const response = await axios.get("http://localhost:8000/api/v1/fuelstations/getAllFuelStations")

//         if (response.data.success) {
//           setStations(response.data.data)
//         } else {
//           setError("Failed to load fuel stations")
//         }
//       } catch (err) {
//         console.error("Error fetching fuel stations:", err)
//         setError("Error fetching fuel stations")
//       } finally {
//         setLoading(false)
//       }
//     }

//     fetchAllStations()
//   }, [])

//   const container = {
//     hidden: { opacity: 0 },
//     show: {
//       opacity: 1,
//       transition: {
//         staggerChildren: 0.1,
//       },
//     },
//   }

//   const item = {
//     hidden: { opacity: 0, y: 20 },
//     show: { opacity: 1, y: 0 },
//   }

//   return (
//     <section className="py-20 bg-muted/30">
//       <div className="container mx-auto px-4">
//         <div className="text-center mb-12">
//           <Badge className="mb-4">All Stations</Badge>
//           <h2 className="text-3xl md:text-4xl font-bold mb-4">Browse All Fuel Stations</h2>
//           <p className="text-muted-foreground max-w-2xl mx-auto">
//             Find the perfect fuel station for your needs with our comprehensive listing.
//           </p>
//         </div>

//         {loading ? (
//           <div className="flex justify-center items-center h-64">
//             <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
//           </div>
//         ) : error ? (
//           <Card className="max-w-md mx-auto border-red-200 bg-red-50">
//             <CardContent className="pt-6">
//               <div className="text-center text-red-500">{error}</div>
//             </CardContent>
//           </Card>
//         ) : (
//           <motion.div
//             className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
//             variants={container}
//             initial="hidden"
//             whileInView="show"
//             viewport={{ once: true, amount: 0.1 }}
//           >
//             {stations.map((station) => (
//               <motion.div key={station._id} variants={item}>
//                 <FuelStationCard station={station} />
//               </motion.div>
//             ))}
//           </motion.div>
//         )}
//       </div>
//     </section>
//   )
// }

