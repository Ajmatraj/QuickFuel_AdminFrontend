import FuelStationRegistration from '@/app/(main)/fuelstation/components/FuelStationRegistration'
import React from 'react'

const Page = () => {
  return (
    <>
       <main className="container mx-auto py-10 px-4">
      <h1 className="text-3xl font-bold mb-8 text-center">Fuel Station Registration</h1>
      <FuelStationRegistration />
    </main>
    </>
  )
}

export default Page
