interface FuelInformationProps {
    fuelType: string
    quantity: number
    totalCost: number
  }
  
  export function FuelInformation({ fuelType, quantity, totalCost }: FuelInformationProps) {
    return (
      <div>
        <h3 className="font-medium mb-2">Fuel Information</h3>
        <div className="space-y-2">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Fuel Type:</span>
            <span className="font-medium">{fuelType}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Quantity:</span>
            <span className="font-medium">{quantity} Liters</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Price:</span>
            <span className="font-medium">₹{totalCost.toFixed(2)}</span>
          </div>
        </div>
      </div>
    )
  }
  
  