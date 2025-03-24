interface DeliveryInformationProps {
    address: string
    phone: string
  }
  
  export function DeliveryInformation({ address, phone }: DeliveryInformationProps) {
    return (
      <div>
        <h3 className="font-medium mb-2">Delivery Information</h3>
        <div className="space-y-2">
          <div>
            <span className="text-muted-foreground">Address:</span>
            <p className="font-medium mt-1">{address}</p>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Contact:</span>
            <span className="font-medium">{phone}</span>
          </div>
        </div>
      </div>
    )
  }
  
  