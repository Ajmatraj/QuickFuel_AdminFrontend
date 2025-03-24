"use client"

import { cn } from "@/lib/utils"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Smartphone } from "lucide-react"

interface PaymentMethodsProps {
  value: string
  onValueChange: (value: string) => void
}

export function PaymentMethods({ value, onValueChange }: PaymentMethodsProps) {
  return (
    <RadioGroup value={value} onValueChange={onValueChange} className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <div
        className={cn(
          "rounded-md border p-4 cursor-pointer transition-all",
          value === "esewa" ? "border-green-500 bg-green-50 dark:bg-green-900/20 shadow-sm" : "hover:bg-muted/50",
        )}
      >
        <RadioGroupItem value="esewa" id="esewa" className="sr-only" />
        <Label htmlFor="esewa" className="flex flex-col items-center gap-2 cursor-pointer">
          <div
            className={cn(
              "h-8 w-8 rounded-full flex items-center justify-center mb-1",
              value === "esewa" ? "bg-green-100 text-green-600" : "text-green-600",
            )}
          >
            <span className="text-lg font-bold">e</span>
          </div>
          <span className="font-medium">eSewa</span>
          <span className="text-xs text-muted-foreground text-center">Pay with your eSewa wallet</span>
        </Label>
      </div>

      <div
        className={cn(
          "rounded-md border p-4 cursor-pointer transition-all",
          value === "khalti" ? "border-purple-500 bg-purple-50 dark:bg-purple-900/20 shadow-sm" : "hover:bg-muted/50",
        )}
      >
        <RadioGroupItem value="khalti" id="khalti" className="sr-only" />
        <Label htmlFor="khalti" className="flex flex-col items-center gap-2 cursor-pointer">
          <div
            className={cn(
              "h-8 w-8 rounded-full flex items-center justify-center mb-1",
              value === "khalti" ? "bg-purple-100 text-purple-600" : "text-purple-600",
            )}
          >
            <span className="text-lg font-bold">K</span>
          </div>
          <span className="font-medium">Khalti</span>
          <span className="text-xs text-muted-foreground text-center">Pay using Khalti digital wallet</span>
        </Label>
      </div>

      <div
        className={cn(
          "rounded-md border p-4 cursor-pointer transition-all",
          value === "phonepay" ? "border-purple-500 bg-purple-50 dark:bg-purple-900/20 shadow-sm" : "hover:bg-muted/50",
        )}
      >
        <RadioGroupItem value="phonepay" id="phonepay" className="sr-only" />
        <Label htmlFor="phonepay" className="flex flex-col items-center gap-2 cursor-pointer">
          <div
            className={cn(
              "h-8 w-8 rounded-full flex items-center justify-center mb-1",
              value === "phonepay" ? "bg-purple-100 text-purple-600" : "text-purple-600",
            )}
          >
            <Smartphone className="h-5 w-5" />
          </div>
          <span className="font-medium">PhonePay</span>
          <span className="text-xs text-muted-foreground text-center">Pay using PhonePay</span>
        </Label>
      </div>
    </RadioGroup>
  )
}

