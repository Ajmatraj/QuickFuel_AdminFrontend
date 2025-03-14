"use client"

import { useState, useEffect } from "react"
import axios from "axios"

export interface FuelType {
  fuelType: string
  price: number
  quantity: number
  _id?: string
}

export interface Station {
  _id: string
  name: string
  imageurl: string
  location: string
  phone: string
  email: string
  stock: string
  fuelTypes: FuelType[]
  user: string
  createdAt: string
  updatedAt: string
}

export function useFuelStations() {
  const [stations, setStations] = useState<Station[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    const fetchAllStations = async () => {
      try {
        const response = await axios.get("http://localhost:8000/api/v1/fuelstations/getAllFuelStations")
        console.log(response)

        if (response.data.success) {
          setStations(response.data.data)
        } else {
          setError("Failed to load fuel stations")
        }
      } catch (err) {
        console.error("Error fetching fuel stations:", err)
        setError("Error fetching fuel stations")
      } finally {
        setLoading(false)
      }
    }

    fetchAllStations()
  }, [])

  return { stations, loading, error }
}

