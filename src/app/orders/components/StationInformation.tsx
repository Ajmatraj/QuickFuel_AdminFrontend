import { ExternalLink } from "lucide-react"

interface StationInformationProps {
  name: string
  location: string
}

export function StationInformation({ name, location }: StationInformationProps) {
  return (
    <div>
      <h3 className="font-medium mb-2">Fuel Station</h3>
      <div className="space-y-2">
        <div className="flex justify-between">
          <span className="text-muted-foreground">Name:</span>
          <span className="font-medium">{name}</span>
        </div>
        <div>
          <span className="text-muted-foreground">Location:</span>
          <a
            href={location}
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary flex items-center gap-1 mt-1"
          >
            View on Maps <ExternalLink className="h-3 w-3" />
          </a>
        </div>
      </div>
    </div>
  )
}

