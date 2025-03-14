import React from 'react'
import RegisterFuelStationPage from './components/FuelStationRegistration'

const Page = () => {
  return (
    <>
       <main className="container mx-auto py-10 px-4">
      <h1 className="text-3xl font-bold mb-8 text-center">Fuel Station Registration</h1>
      <RegisterFuelStationPage />
    </main>
    </>
  )
}

export default Page
