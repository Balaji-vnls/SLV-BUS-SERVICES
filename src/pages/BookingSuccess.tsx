import { useEffect, useState } from 'react'
import { useSearchParams, useNavigate } from 'react-router-dom'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import Header from '@/components/Header'
import { CheckCircle, Calendar, Clock, MapPin, Users, Download } from 'lucide-react'
import { supabase } from '@/lib/supabase'
import { useToast } from '@/hooks/use-toast'

interface BookingDetails {
  id: string
  booking_reference: string
  total_amount: number
  seat_numbers: string[]
  passenger_details: any[]
  booking_status: string
  payment_status: string
  schedules: {
    journey_date: string
    departure_time: string
    arrival_time: string
    routes: {
      from_city: string
      to_city: string
    }
    buses: {
      bus_number: string
      operator: string
    }
  }
}

const BookingSuccess = () => {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const { toast } = useToast()
  const [booking, setBooking] = useState<BookingDetails | null>(null)
  const [loading, setLoading] = useState(true)

  const bookingId = searchParams.get('booking_id')
  const sessionId = searchParams.get('session_id')

  useEffect(() => {
    const verifyAndFetchBooking = async () => {
      if (!bookingId) {
        toast({
          title: "Error",
          description: "No booking ID provided",
          variant: "destructive",
        })
        navigate('/')
        return
      }

      try {
        // If session ID is present, verify payment first
        if (sessionId) {
          const { error: verifyError } = await supabase.functions.invoke('verify-payment', {
            body: { sessionId }
          })

          if (verifyError) {
            throw verifyError
          }
        }

        // Fetch booking details
        const { data, error } = await supabase
          .from('bookings')
          .select(`
            *,
            schedules(
              journey_date,
              departure_time,
              arrival_time,
              routes(from_city, to_city),
              buses(bus_number, operator)
            )
          `)
          .eq('id', bookingId)
          .single()

        if (error) throw error

        setBooking(data)
      } catch (error: any) {
        console.error('Error fetching booking:', error)
        toast({
          title: "Error",
          description: error.message || "Failed to fetch booking details",
          variant: "destructive",
        })
        navigate('/')
      } finally {
        setLoading(false)
      }
    }

    verifyAndFetchBooking()
  }, [bookingId, sessionId, navigate, toast])

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  const formatTime = (timeString: string) => {
    return new Date(`2000-01-01T${timeString}`).toLocaleTimeString('en-IN', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    })
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="flex items-center justify-center py-20">
          <div className="text-center">
            <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-muted-foreground">Verifying your booking...</p>
          </div>
        </div>
      </div>
    )
  }

  if (!booking) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-destructive mb-4">Booking Not Found</h1>
            <Button onClick={() => navigate('/')}>Go Home</Button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <div className="container mx-auto px-4 py-8 max-w-2xl">
        {/* Success Header */}
        <div className="text-center mb-8">
          <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
          <h1 className="text-3xl font-bold text-green-600 mb-2">Booking Confirmed!</h1>
          <p className="text-muted-foreground">Your bus ticket has been booked successfully</p>
        </div>

        {/* Booking Details Card */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Booking Details</span>
              <Badge variant={booking.booking_status === 'confirmed' ? 'default' : 'secondary'}>
                {booking.booking_status.toUpperCase()}
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Booking Reference */}
            <div className="text-center p-4 bg-muted rounded-lg">
              <p className="text-sm text-muted-foreground mb-1">Booking Reference</p>
              <p className="text-2xl font-bold">{booking.booking_reference}</p>
            </div>

            {/* Journey Details */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">Route</span>
                </div>
                <p className="font-semibold">
                  {booking.schedules.routes.from_city} → {booking.schedules.routes.to_city}
                </p>
              </div>

              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">Journey Date</span>
                </div>
                <p className="font-semibold">{formatDate(booking.schedules.journey_date)}</p>
              </div>

              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">Departure</span>
                </div>
                <p className="font-semibold">{formatTime(booking.schedules.departure_time)}</p>
              </div>

              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">Arrival</span>
                </div>
                <p className="font-semibold">{formatTime(booking.schedules.arrival_time)}</p>
              </div>
            </div>

            {/* Bus Details */}
            <div className="border-t pt-4">
              <p className="text-sm text-muted-foreground mb-2">Bus Details</p>
              <p className="font-semibold">{booking.schedules.buses.operator}</p>
              <p className="text-sm text-muted-foreground">{booking.schedules.buses.bus_number}</p>
            </div>

            {/* Seat Details */}
            <div className="border-t pt-4">
              <div className="flex items-center gap-2 mb-2">
                <Users className="w-4 h-4 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">Seats Booked</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {booking.seat_numbers.map((seat) => (
                  <Badge key={seat} variant="outline">{seat}</Badge>
                ))}
              </div>
            </div>

            {/* Payment Details */}
            <div className="border-t pt-4">
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Total Amount</span>
                <span className="text-lg font-bold">₹{booking.total_amount}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Payment Status</span>
                <Badge variant={booking.payment_status === 'paid' ? 'default' : 'destructive'}>
                  {booking.payment_status.toUpperCase()}
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4">
          <Button className="flex-1" onClick={() => navigate('/profile')}>
            <Download className="w-4 h-4 mr-2" />
            View All Bookings
          </Button>
          <Button variant="outline" className="flex-1" onClick={() => navigate('/')}>
            Book Another Ticket
          </Button>
        </div>

        {/* Important Notice */}
        <Card className="mt-6 border-amber-200 bg-amber-50">
          <CardContent className="pt-4">
            <h3 className="font-semibold text-amber-800 mb-2">Important Notes:</h3>
            <ul className="text-sm text-amber-700 space-y-1">
              <li>• Please carry a valid photo ID during your journey</li>
              <li>• Arrive at the boarding point 15 minutes before departure</li>
              <li>• Keep your booking reference handy for verification</li>
              <li>• Contact customer support for any changes or cancellations</li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default BookingSuccess