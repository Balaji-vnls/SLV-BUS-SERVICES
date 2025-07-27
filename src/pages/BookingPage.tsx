import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { BookingFlow } from '@/components/booking/BookingFlow'
import Header from '@/components/Header'
import { useAuth } from '@/contexts/AuthContext'
import { Loader2 } from 'lucide-react'
import { useToast } from '@/hooks/use-toast'

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

const BookingPage = () => {
  const { scheduleId } = useParams()
  const navigate = useNavigate()
  const { user, loading: authLoading } = useAuth()
  const { toast } = useToast()
  const [schedule, setSchedule] = useState<Schedule | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (authLoading) return
    
    if (!user) {
      navigate('/', { replace: true })
      return
    }
    
    loadSchedule()
  }, [scheduleId, user, authLoading, navigate])

  const loadSchedule = async () => {
    if (!scheduleId) return
    
    setLoading(true)
    try {
      // Simulate API call - replace with actual Supabase query
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      // Mock schedule data
      const mockSchedule: Schedule = {
        id: scheduleId,
        departure_time: '22:00',
        arrival_time: '06:00',
        price: 650,
        available_seats: 12,
        journey_date: new Date().toISOString().split('T')[0],
        bus: {
          bus_number: 'TN 45 BC 5678',
          bus_type: 'AC Semi-Sleeper',
          operator: 'Sri Lakshmi Venkateshwara',
          amenities: ['WiFi', 'TV', 'Charging', 'Blanket']
        },
        route: {
          from_city: 'Chennai',
          to_city: 'Bangalore',
          duration_hours: 8
        }
      }
      
      setSchedule(mockSchedule)
    } catch (error) {
      toast({
        title: "Error loading booking details",
        description: "Failed to load booking information. Please try again.",
        variant: "destructive"
      })
      navigate('/search')
    } finally {
      setLoading(false)
    }
  }

  const handleBookingComplete = (bookingId: string) => {
    toast({
      title: "Booking Confirmed!",
      description: `Your booking ${bookingId} has been confirmed successfully.`,
    })
    navigate('/profile?tab=bookings')
  }

  const handleCancel = () => {
    navigate('/search')
  }

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="flex items-center justify-center py-20">
          <div className="text-center">
            <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4" />
            <p className="text-muted-foreground">Loading booking details...</p>
          </div>
        </div>
      </div>
    )
  }

  if (!schedule) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="flex items-center justify-center py-20">
          <div className="text-center">
            <h2 className="text-2xl font-bold mb-2">Schedule not found</h2>
            <p className="text-muted-foreground mb-4">
              The requested bus schedule could not be found.
            </p>
            <button 
              onClick={() => navigate('/search')}
              className="text-primary hover:underline"
            >
              Go back to search
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <BookingFlow
        schedule={schedule}
        onBookingComplete={handleBookingComplete}
        onCancel={handleCancel}
      />
    </div>
  )
}

export default BookingPage