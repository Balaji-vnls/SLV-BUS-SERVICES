import { useState, useEffect } from 'react'
import { useSearchParams, useNavigate } from 'react-router-dom'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import { AuthModal } from '@/components/auth/AuthModal'
import { useAuth } from '@/contexts/AuthContext'
import { Clock, MapPin, Calendar, Star, Wifi, Tv, Zap, Users, Filter } from 'lucide-react'
import { useToast } from '@/hooks/use-toast'

interface BusSchedule {
  id: string
  departure_time: string
  arrival_time: string
  price: number
  available_seats: number
  journey_date: string
  bus: {
    id: string
    bus_number: string
    bus_type: string
    operator: string
    amenities: string[]
    total_seats: number
  }
  route: {
    id: string
    from_city: string
    to_city: string
    duration_hours: number
    distance_km: number
  }
}

const SearchResults = () => {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const { user } = useAuth()
  const { toast } = useToast()
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false)
  const [schedules, setSchedules] = useState<BusSchedule[]>([])
  const [loading, setLoading] = useState(true)
  const [sortBy, setSortBy] = useState('departure_time')
  const [filterBy, setFilterBy] = useState('all')

  // Get search parameters
  const from = searchParams.get('from')
  const to = searchParams.get('to')
  const date = searchParams.get('date')
  const passengers = searchParams.get('passengers') || '1'

  useEffect(() => {
    loadBusSchedules()
  }, [from, to, date, sortBy, filterBy])

  const loadBusSchedules = async () => {
    setLoading(true)
    try {
      // Simulate API call - replace with actual Supabase query
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      const mockSchedules: BusSchedule[] = [
        {
          id: '1',
          departure_time: '06:00',
          arrival_time: '14:00',
          price: 450,
          available_seats: 15,
          journey_date: date || new Date().toISOString().split('T')[0],
          bus: {
            id: 'bus1',
            bus_number: 'TN 45 BC 1234',
            bus_type: 'AC Sleeper',
            operator: 'Sri Lakshmi Venkateshwara',
            amenities: ['WiFi', 'TV', 'Charging', 'Blanket'],
            total_seats: 40
          },
          route: {
            id: 'route1',
            from_city: from || 'Chennai',
            to_city: to || 'Bangalore',
            duration_hours: 8,
            distance_km: 350
          }
        },
        {
          id: '2',
          departure_time: '22:00',
          arrival_time: '06:00',
          price: 650,
          available_seats: 8,
          journey_date: date || new Date().toISOString().split('T')[0],
          bus: {
            id: 'bus2',
            bus_number: 'TN 45 BC 5678',
            bus_type: 'AC Semi-Sleeper',
            operator: 'Sri Lakshmi Venkateshwara',
            amenities: ['WiFi', 'Charging', 'Blanket'],
            total_seats: 42
          },
          route: {
            id: 'route1',
            from_city: from || 'Chennai',
            to_city: to || 'Bangalore',
            duration_hours: 8,
            distance_km: 350
          }
        },
        {
          id: '3',
          departure_time: '15:30',
          arrival_time: '23:30',
          price: 380,
          available_seats: 22,
          journey_date: date || new Date().toISOString().split('T')[0],
          bus: {
            id: 'bus3',
            bus_number: 'TN 45 BC 9012',
            bus_type: 'Non-AC Seater',
            operator: 'Sri Lakshmi Venkateshwara',
            amenities: ['Charging'],
            total_seats: 45
          },
          route: {
            id: 'route1',
            from_city: from || 'Chennai',
            to_city: to || 'Bangalore',
            duration_hours: 8,
            distance_km: 350
          }
        }
      ]
      
      setSchedules(mockSchedules)
    } catch (error) {
      toast({
        title: "Error loading schedules",
        description: "Failed to load bus schedules. Please try again.",
        variant: "destructive"
      })
    } finally {
      setLoading(false)
    }
  }

  const handleBookNow = (scheduleId: string) => {
    if (!user) {
      setIsAuthModalOpen(true)
      return
    }
    navigate(`/booking/${scheduleId}`)
  }

  const getAmenityIcon = (amenity: string) => {
    switch (amenity.toLowerCase()) {
      case 'wifi': return <Wifi className="w-4 h-4" />
      case 'tv': return <Tv className="w-4 h-4" />
      case 'charging': return <Zap className="w-4 h-4" />
      default: return null
    }
  }

  const sortedAndFilteredSchedules = schedules
    .filter(schedule => {
      if (filterBy === 'all') return true
      if (filterBy === 'ac') return schedule.bus.bus_type.toLowerCase().includes('ac')
      if (filterBy === 'sleeper') return schedule.bus.bus_type.toLowerCase().includes('sleeper')
      if (filterBy === 'seater') return schedule.bus.bus_type.toLowerCase().includes('seater')
      return true
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'price_low': return a.price - b.price
        case 'price_high': return b.price - a.price
        case 'departure_time': return a.departure_time.localeCompare(b.departure_time)
        case 'duration': return a.route.duration_hours - b.route.duration_hours
        default: return 0
      }
    })

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto px-4 py-8">
          <div className="space-y-4">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-32 bg-muted animate-pulse rounded-lg"></div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <div className="container mx-auto px-4 py-8">
        {/* Search Summary */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold mb-2">
            {from} → {to}
          </h1>
          <div className="flex items-center gap-4 text-muted-foreground">
            <div className="flex items-center gap-1">
              <Calendar className="w-4 h-4" />
              {date ? new Date(date).toLocaleDateString() : 'Today'}
            </div>
            <div className="flex items-center gap-1">
              <Users className="w-4 h-4" />
              {passengers} passenger{parseInt(passengers) > 1 ? 's' : ''}
            </div>
          </div>
        </div>

        {/* Filters and Sort */}
        <div className="flex flex-wrap gap-4 mb-6 p-4 bg-card rounded-lg">
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4" />
            <span className="text-sm font-medium">Filter:</span>
            <Select value={filterBy} onValueChange={setFilterBy}>
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All</SelectItem>
                <SelectItem value="ac">AC</SelectItem>
                <SelectItem value="sleeper">Sleeper</SelectItem>
                <SelectItem value="seater">Seater</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium">Sort by:</span>
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-40">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="departure_time">Departure Time</SelectItem>
                <SelectItem value="price_low">Price: Low to High</SelectItem>
                <SelectItem value="price_high">Price: High to Low</SelectItem>
                <SelectItem value="duration">Duration</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Results */}
        <div className="space-y-4">
          {sortedAndFilteredSchedules.length === 0 ? (
            <Card>
              <CardContent className="py-12 text-center">
                <h3 className="text-lg font-medium mb-2">No buses found</h3>
                <p className="text-muted-foreground">
                  No buses available for the selected route and date. 
                  Please try different search criteria.
                </p>
              </CardContent>
            </Card>
          ) : (
            sortedAndFilteredSchedules.map((schedule) => (
              <Card key={schedule.id} className="hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-4">
                        <div>
                          <h3 className="font-semibold text-lg">{schedule.bus.operator}</h3>
                          <div className="flex items-center gap-2 mt-1">
                            <Badge variant="secondary">{schedule.bus.bus_type}</Badge>
                            <span className="text-sm text-muted-foreground">
                              {schedule.bus.bus_number}
                            </span>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-2xl font-bold">₹{schedule.price}</div>
                          <div className="text-sm text-muted-foreground">per seat</div>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <div className="font-medium">{schedule.departure_time}</div>
                            <div className="text-sm text-muted-foreground">{schedule.route.from_city}</div>
                          </div>
                          <div className="text-center">
                            <div className="text-sm text-muted-foreground">{schedule.route.duration_hours}h 0m</div>
                            <div className="w-16 h-px bg-border"></div>
                          </div>
                          <div className="text-right">
                            <div className="font-medium">{schedule.arrival_time}</div>
                            <div className="text-sm text-muted-foreground">{schedule.route.to_city}</div>
                          </div>
                        </div>
                        
                        <div className="flex items-center justify-center">
                          <div className="flex items-center gap-2">
                            {schedule.bus.amenities.map((amenity, index) => (
                              <div key={index} className="flex items-center gap-1 text-sm text-muted-foreground">
                                {getAmenityIcon(amenity)}
                                <span>{amenity}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                        
                        <div className="flex items-center justify-end gap-4">
                          <div className="text-right">
                            <div className="text-sm font-medium text-green-600">
                              {schedule.available_seats} seats available
                            </div>
                            <div className="flex items-center gap-1 text-sm text-muted-foreground">
                              <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                              4.2
                            </div>
                          </div>
                          <Button 
                            onClick={() => handleBookNow(schedule.id)}
                            className="min-w-[100px]"
                            disabled={schedule.available_seats === 0}
                          >
                            {schedule.available_seats === 0 ? 'Sold Out' : 'Book Now'}
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>
      
      <Footer />
      
      <AuthModal 
        isOpen={isAuthModalOpen} 
        onClose={() => setIsAuthModalOpen(false)}
        defaultTab="login"
      />
    </div>
  )
}

export default SearchResults