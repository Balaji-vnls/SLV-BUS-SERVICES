import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'
import { SeatSelection } from './SeatSelection'
import { Badge } from '@/components/ui/badge'
import { Clock, MapPin, Calendar, User, CreditCard, Check } from 'lucide-react'
import { useToast } from '@/hooks/use-toast'
import { cn } from '@/lib/utils'

interface Schedule {
  id: string
  departure_time: string
  arrival_time: string
  price: number
  available_seats: number
  journey_date: string
  bus: {
    bus_number: string
    bus_type: string
    operator: string
    amenities: string[]
  }
  route: {
    from_city: string
    to_city: string
    duration_hours: number
  }
}

interface BookingFlowProps {
  schedule: Schedule
  onBookingComplete: (bookingId: string) => void
  onCancel: () => void
}

interface PassengerDetail {
  name: string
  age: string
  gender: 'Male' | 'Female' | 'Other'
}

export const BookingFlow = ({ schedule, onBookingComplete, onCancel }: BookingFlowProps) => {
  const [currentStep, setCurrentStep] = useState(1)
  const [selectedSeats, setSelectedSeats] = useState<string[]>([])
  const [passengerDetails, setPassengerDetails] = useState<PassengerDetail[]>([])
  const [contactInfo, setContactInfo] = useState({ email: '', phone: '' })
  const [isProcessing, setIsProcessing] = useState(false)
  const { toast } = useToast()

  const bookedSeats = ['1A', '2B', '3C'] // This would come from your database

  const handleSeatSelection = (seats: string[]) => {
    setSelectedSeats(seats)
    // Initialize passenger details for selected seats
    const newPassengerDetails = seats.map((_, index) => 
      passengerDetails[index] || { name: '', age: '', gender: 'Male' as const }
    )
    setPassengerDetails(newPassengerDetails)
  }

  const updatePassengerDetail = (index: number, field: keyof PassengerDetail, value: string) => {
    const updated = [...passengerDetails]
    updated[index] = { ...updated[index], [field]: value }
    setPassengerDetails(updated)
  }

  const validateStep = () => {
    switch (currentStep) {
      case 1:
        return selectedSeats.length > 0
      case 2:
        return passengerDetails.every(p => p.name && p.age) && contactInfo.email && contactInfo.phone
      case 3:
        return true
      default:
        return false
    }
  }

  const calculateTotal = () => {
    return selectedSeats.length * schedule.price
  }

  const handlePayment = async () => {
    setIsProcessing(true)
    
    try {
      // Simulate payment processing
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      // Create booking in database
      const bookingData = {
        schedule_id: schedule.id,
        seat_numbers: selectedSeats,
        passenger_details: passengerDetails,
        total_amount: calculateTotal(),
        contact_info: contactInfo,
      }
      
      // This would call your booking API
      console.log('Booking data:', bookingData)
      
      toast({
        title: "Booking Confirmed!",
        description: "Your bus tickets have been booked successfully.",
      })
      
      onBookingComplete('BOOKING-' + Date.now())
    } catch (error) {
      toast({
        title: "Booking Failed",
        description: "There was an error processing your booking. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsProcessing(false)
    }
  }

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <SeatSelection
            busType={schedule.bus.bus_type}
            totalSeats={42} // This would come from your database
            bookedSeats={bookedSeats}
            onSeatSelect={handleSeatSelection}
            maxSeats={6}
          />
        )
      
      case 2:
        return (
          <Card>
            <CardHeader>
              <CardTitle>Passenger Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {selectedSeats.map((seat, index) => (
                <div key={seat} className="p-4 border rounded-lg space-y-4">
                  <h4 className="font-medium">Passenger {index + 1} - Seat {seat}</h4>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor={`name-${index}`}>Full Name</Label>
                      <Input
                        id={`name-${index}`}
                        placeholder="Enter full name"
                        value={passengerDetails[index]?.name || ''}
                        onChange={(e) => updatePassengerDetail(index, 'name', e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor={`age-${index}`}>Age</Label>
                      <Input
                        id={`age-${index}`}
                        type="number"
                        placeholder="Age"
                        value={passengerDetails[index]?.age || ''}
                        onChange={(e) => updatePassengerDetail(index, 'age', e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor={`gender-${index}`}>Gender</Label>
                      <select
                        id={`gender-${index}`}
                        className="w-full h-10 px-3 border border-input bg-background rounded-md text-sm"
                        value={passengerDetails[index]?.gender || 'Male'}
                        onChange={(e) => updatePassengerDetail(index, 'gender', e.target.value as 'Male' | 'Female' | 'Other')}
                      >
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                        <option value="Other">Other</option>
                      </select>
                    </div>
                  </div>
                </div>
              ))}
              
              <Separator />
              
              <div className="space-y-4">
                <h4 className="font-medium">Contact Information</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="your@email.com"
                      value={contactInfo.email}
                      onChange={(e) => setContactInfo({ ...contactInfo, email: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input
                      id="phone"
                      type="tel"
                      placeholder="+91 9876543210"
                      value={contactInfo.phone}
                      onChange={(e) => setContactInfo({ ...contactInfo, phone: e.target.value })}
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )
      
      case 3:
        return (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CreditCard className="w-5 h-5" />
                Payment & Confirmation
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Booking Summary */}
              <div className="p-4 bg-muted rounded-lg space-y-3">
                <h4 className="font-medium">Booking Summary</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Route:</span>
                    <span>{schedule.route.from_city} → {schedule.route.to_city}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Date:</span>
                    <span>{new Date(schedule.journey_date).toLocaleDateString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Time:</span>
                    <span>{schedule.departure_time} - {schedule.arrival_time}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Seats:</span>
                    <span>{selectedSeats.join(', ')}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Passengers:</span>
                    <span>{selectedSeats.length}</span>
                  </div>
                  <Separator />
                  <div className="flex justify-between font-medium">
                    <span>Total Amount:</span>
                    <span>₹{calculateTotal()}</span>
                  </div>
                </div>
              </div>

              {/* Payment Options */}
              <div className="space-y-4">
                <h4 className="font-medium">Payment Method</h4>
                <div className="grid gap-3">
                  <Button variant="outline" className="justify-start h-auto p-4">
                    <div className="text-left">
                      <div className="font-medium">Razorpay</div>
                      <div className="text-sm text-muted-foreground">Credit/Debit Card, UPI, Net Banking</div>
                    </div>
                  </Button>
                  <Button variant="outline" className="justify-start h-auto p-4">
                    <div className="text-left">
                      <div className="font-medium">UPI</div>
                      <div className="text-sm text-muted-foreground">Pay using UPI apps</div>
                    </div>
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )
      
      default:
        return null
    }
  }

  return (
    <div className="max-w-4xl mx-auto p-4 space-y-6">
      {/* Progress Steps */}
      <div className="flex items-center justify-center space-x-8 mb-8">
        {[1, 2, 3].map((step) => (
          <div key={step} className="flex items-center">
            <div className={cn(
              "w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium",
              step < currentStep ? "bg-primary text-primary-foreground" :
              step === currentStep ? "bg-primary text-primary-foreground" :
              "bg-muted text-muted-foreground"
            )}>
              {step < currentStep ? <Check className="w-4 h-4" /> : step}
            </div>
            <span className="ml-2 text-sm font-medium">
              {step === 1 ? "Select Seats" : step === 2 ? "Passenger Details" : "Payment"}
            </span>
            {step < 3 && <div className="w-16 h-px bg-muted ml-4" />}
          </div>
        ))}
      </div>

      {/* Bus Info */}
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <h3 className="font-semibold">{schedule.bus.operator}</h3>
              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <div className="flex items-center gap-1">
                  <MapPin className="w-4 h-4" />
                  {schedule.route.from_city} → {schedule.route.to_city}
                </div>
                <div className="flex items-center gap-1">
                  <Calendar className="w-4 h-4" />
                  {new Date(schedule.journey_date).toLocaleDateString()}
                </div>
                <div className="flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  {schedule.departure_time}
                </div>
              </div>
            </div>
            <Badge variant="secondary">{schedule.bus.bus_type}</Badge>
          </div>
        </CardContent>
      </Card>

      {/* Step Content */}
      {renderStepContent()}

      {/* Action Buttons */}
      <div className="flex justify-between">
        <Button variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <div className="space-x-2">
          {currentStep > 1 && (
            <Button variant="outline" onClick={() => setCurrentStep(currentStep - 1)}>
              Previous
            </Button>
          )}
          {currentStep < 3 ? (
            <Button 
              onClick={() => setCurrentStep(currentStep + 1)}
              disabled={!validateStep()}
            >
              Next
            </Button>
          ) : (
            <Button 
              onClick={handlePayment}
              disabled={!validateStep() || isProcessing}
              className="min-w-[120px]"
            >
              {isProcessing ? "Processing..." : `Pay ₹${calculateTotal()}`}
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}