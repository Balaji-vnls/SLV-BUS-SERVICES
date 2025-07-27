import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'

interface SeatSelectionProps {
  busType: string
  totalSeats: number
  bookedSeats: string[]
  onSeatSelect: (seats: string[]) => void
  maxSeats?: number
}

export const SeatSelection = ({ 
  busType, 
  totalSeats, 
  bookedSeats, 
  onSeatSelect, 
  maxSeats = 6 
}: SeatSelectionProps) => {
  const [selectedSeats, setSelectedSeats] = useState<string[]>([])

  const generateSeatLayout = () => {
    const seats = []
    const seatsPerRow = busType.includes('Sleeper') ? 4 : 4
    const rows = Math.ceil(totalSeats / seatsPerRow)

    for (let row = 1; row <= rows; row++) {
      const rowSeats = []
      for (let seatInRow = 1; seatInRow <= seatsPerRow; seatInRow++) {
        const seatNumber = `${row}${String.fromCharCode(64 + seatInRow)}`
        if (seats.length < totalSeats) {
          rowSeats.push(seatNumber)
        }
      }
      if (rowSeats.length > 0) {
        seats.push(rowSeats)
      }
    }
    return seats
  }

  const seatLayout = generateSeatLayout()

  const toggleSeat = (seatNumber: string) => {
    if (bookedSeats.includes(seatNumber)) return

    let newSelectedSeats
    if (selectedSeats.includes(seatNumber)) {
      newSelectedSeats = selectedSeats.filter(seat => seat !== seatNumber)
    } else {
      if (selectedSeats.length >= maxSeats) return
      newSelectedSeats = [...selectedSeats, seatNumber]
    }
    
    setSelectedSeats(newSelectedSeats)
    onSeatSelect(newSelectedSeats)
  }

  const getSeatStatus = (seatNumber: string) => {
    if (bookedSeats.includes(seatNumber)) return 'booked'
    if (selectedSeats.includes(seatNumber)) return 'selected'
    return 'available'
  }

  const getSeatColor = (status: string) => {
    switch (status) {
      case 'booked': return 'bg-destructive text-destructive-foreground'
      case 'selected': return 'bg-primary text-primary-foreground'
      case 'available': return 'bg-secondary hover:bg-secondary/80 text-secondary-foreground'
      default: return 'bg-secondary text-secondary-foreground'
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          Select Seats
          <Badge variant="outline">
            {selectedSeats.length} / {maxSeats} selected
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Driver section */}
        <div className="flex justify-end">
          <div className="w-12 h-8 bg-muted rounded flex items-center justify-center text-xs font-medium">
            Driver
          </div>
        </div>

        {/* Seat layout */}
        <div className="space-y-2">
          {seatLayout.map((row, rowIndex) => (
            <div key={rowIndex} className="flex gap-2 justify-center">
              {row.map((seat, seatIndex) => {
                const status = getSeatStatus(seat)
                return (
                  <Button
                    key={seat}
                    variant="outline"
                    size="sm"
                    className={cn(
                      "w-12 h-12 p-0 text-xs font-medium transition-all",
                      getSeatColor(status),
                      status === 'booked' && "cursor-not-allowed opacity-60",
                      seatIndex === 1 && "mr-4" // Aisle gap
                    )}
                    onClick={() => toggleSeat(seat)}
                    disabled={status === 'booked'}
                  >
                    {seat}
                  </Button>
                )
              })}
            </div>
          ))}
        </div>

        {/* Legend */}
        <div className="flex justify-center gap-6 text-sm">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-secondary rounded"></div>
            <span>Available</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-primary rounded"></div>
            <span>Selected</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-destructive rounded"></div>
            <span>Booked</span>
          </div>
        </div>

        {selectedSeats.length > 0 && (
          <div className="mt-4 p-4 bg-muted rounded-lg">
            <p className="font-medium">Selected Seats:</p>
            <p className="text-sm text-muted-foreground mt-1">
              {selectedSeats.join(', ')}
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}