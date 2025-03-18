"use client"

import { FuelIcon as GasPump, ChevronRight } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { cn } from "@/lib/utils"

export function FuelStationList({ fuelStations, selectedStationId, onSelectStation }) {
  return (
    <Card>
      <CardContent className="p-4">
        <h2 className="text-lg font-semibold mb-3">Your Fuel Stations</h2>
        <ScrollArea className="h-full max-h-[120px]">
          <div className="space-y-2">
            {fuelStations.map((station) => (
              <div
                key={station._id}
                className={cn(
                  "flex items-center justify-between p-3 rounded-md cursor-pointer transition-colors",
                  selectedStationId === station._id ? "bg-primary/10 border border-primary/20" : "hover:bg-muted",
                )}
                onClick={() => onSelectStation(station._id)}
              >
                <div className="flex items-center gap-3">
                  <div
                    className={cn("p-2 rounded-full", selectedStationId === station._id ? "bg-primary/20" : "bg-muted")}
                  >
                    <GasPump
                      className={cn(
                        "h-5 w-5",
                        selectedStationId === station._id ? "text-primary" : "text-muted-foreground",
                      )}
                    />
                  </div>
                  <div>
                    <p className="font-medium">{station.name || "Fuel Station"}</p>
                    <p className="text-sm text-muted-foreground truncate max-w-[200px] md:max-w-[400px]">
                      {station.address}
                    </p>
                  </div>
                </div>
                <ChevronRight
                  className={cn(
                    "h-5 w-5",
                    selectedStationId === station._id ? "text-primary" : "text-muted-foreground",
                  )}
                />
              </div>
            ))}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  )
}

