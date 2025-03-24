export interface DeliveryAddress {
    latitude: number
    longitude: number
    address: string
    _id: string
  }
  
  export interface OrderUser {
    _id: string
    email: string
    name: string
  }
  
  export interface Order {
    _id: string
    user: OrderUser
    status: string
    station: string
    fuelType: string
    quantity: number
    totalCost: number
    phone: string
    deliveryAddress: DeliveryAddress
    orderDate: string
    createdAt: string
    updatedAt: string
    __v: number
    paymentStatus?: string
  }
  
  