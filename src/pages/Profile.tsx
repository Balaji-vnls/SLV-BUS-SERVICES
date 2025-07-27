import { useState, useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import { useAuth } from '@/contexts/AuthContext'
import { User, Calendar, MapPin, Clock, CreditCard, Download, LogOut, Phone, Mail, Edit } from 'lucide-react'
import { useToast } from '@/hooks/use-toast'

interface UserProfile {
  full_name: string
  phone: string | null
  date_of_birth: string | null
}

interface Booking {
  id: string
  booking_reference: string
  total_amount: number
  booking_status: string
  payment_status: string
  seat_numbers: string[]
  created_at: string
  schedule: {
    departure_time: string
    arrival_time: string
    journey_date: string
    bus: {
      bus_number: string
      bus_type: string
      operator: string
    }
    route: {
      from_city: string
      to_city: string
    }
  }
}

const Profile = () => {
  const [searchParams] = useSearchParams()
  const defaultTab = searchParams.get('tab') || 'profile'
  const navigate = useNavigate()
  const { user, signOut, loading } = useAuth()
  const { toast } = useToast()
  
  const [profile, setProfile] = useState<UserProfile>({
    full_name: '',
    phone: null,
    date_of_birth: null
  })
  const [bookings, setBookings] = useState<Booking[]>([])
  const [isEditing, setIsEditing] = useState(false)
  const [isSaving, setIsSaving] = useState(false)

  useEffect(() => {
    if (loading) return
    
    if (!user) {
      navigate('/', { replace: true })
      return
    }
    
    loadProfile()
    loadBookings()
  }, [user, loading, navigate])

  const loadProfile = async () => {
    if (!user) return
    
    try {
      // Mock profile data - replace with actual Supabase query
      const mockProfile: UserProfile = {
        full_name: user.user_metadata?.full_name || user.email?.split('@')[0] || '',
        phone: '+91 9876543210',
        date_of_birth: '1990-01-15'
      }
      
      setProfile(mockProfile)
    } catch (error) {
      toast({
        title: "Error loading profile",
        description: "Failed to load profile information.",
        variant: "destructive"
      })
    }
  }

  const loadBookings = async () => {
    if (!user) return
    
    try {
      // Mock bookings data - replace with actual Supabase query
      const mockBookings: Booking[] = [
        {
          id: '1',
          booking_reference: 'SLVBS240001',
          total_amount: 1300,
          booking_status: 'confirmed',
          payment_status: 'paid',
          seat_numbers: ['15A', '15B'],
          created_at: '2024-01-15T10:30:00Z',
          schedule: {
            departure_time: '22:00',
            arrival_time: '06:00',
            journey_date: '2024-02-01',
            bus: {
              bus_number: 'TN 45 BC 5678',
              bus_type: 'AC Semi-Sleeper',
              operator: 'Sri Lakshmi Venkateshwara'
            },
            route: {
              from_city: 'Chennai',
              to_city: 'Bangalore'
            }
          }
        },
        {
          id: '2',
          booking_reference: 'SLVBS240002',
          total_amount: 450,
          booking_status: 'completed',
          payment_status: 'paid',
          seat_numbers: ['8C'],
          created_at: '2023-12-20T15:45:00Z',
          schedule: {
            departure_time: '06:00',
            arrival_time: '14:00',
            journey_date: '2023-12-25',
            bus: {
              bus_number: 'TN 45 BC 1234',
              bus_type: 'AC Sleeper',
              operator: 'Sri Lakshmi Venkateshwara'
            },
            route: {
              from_city: 'Bangalore',
              to_city: 'Chennai'
            }
          }
        }
      ]
      
      setBookings(mockBookings)
    } catch (error) {
      toast({
        title: "Error loading bookings",
        description: "Failed to load booking history.",
        variant: "destructive"
      })
    }
  }

  const handleUpdateProfile = async () => {
    setIsSaving(true)
    try {
      // Update profile in Supabase
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      toast({
        title: "Profile updated",
        description: "Your profile has been updated successfully.",
      })
      setIsEditing(false)
    } catch (error) {
      toast({
        title: "Error updating profile",
        description: "Failed to update profile. Please try again.",
        variant: "destructive"
      })
    } finally {
      setIsSaving(false)
    }
  }

  const handleSignOut = async () => {
    await signOut()
    navigate('/')
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed': return 'bg-blue-500'
      case 'completed': return 'bg-green-500'
      case 'cancelled': return 'bg-red-500'
      case 'pending': return 'bg-yellow-500'
      default: return 'bg-gray-500'
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="flex items-center justify-center py-20">
          <div className="text-center">
            <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading profile...</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold">My Account</h1>
              <p className="text-muted-foreground">Manage your profile and bookings</p>
            </div>
            <Button variant="outline" onClick={handleSignOut}>
              <LogOut className="w-4 h-4 mr-2" />
              Sign Out
            </Button>
          </div>

          <Tabs defaultValue={defaultTab} className="space-y-6">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="profile">Profile</TabsTrigger>
              <TabsTrigger value="bookings">My Bookings</TabsTrigger>
            </TabsList>

            <TabsContent value="profile" className="space-y-6">
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center gap-2">
                      <User className="w-5 h-5" />
                      Profile Information
                    </CardTitle>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => setIsEditing(!isEditing)}
                    >
                      <Edit className="w-4 h-4 mr-2" />
                      {isEditing ? 'Cancel' : 'Edit'}
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="email"
                          value={user?.email || ''}
                          disabled
                          className="pl-10 bg-muted"
                        />
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="name">Full Name</Label>
                      <Input
                        id="name"
                        value={profile.full_name}
                        onChange={(e) => setProfile({ ...profile, full_name: e.target.value })}
                        disabled={!isEditing}
                        className={!isEditing ? "bg-muted" : ""}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone Number</Label>
                      <div className="relative">
                        <Phone className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="phone"
                          value={profile.phone || ''}
                          onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                          disabled={!isEditing}
                          className={`pl-10 ${!isEditing ? "bg-muted" : ""}`}
                          placeholder="+91 XXXXXXXXXX"
                        />
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="dob">Date of Birth</Label>
                      <Input
                        id="dob"
                        type="date"
                        value={profile.date_of_birth || ''}
                        onChange={(e) => setProfile({ ...profile, date_of_birth: e.target.value })}
                        disabled={!isEditing}
                        className={!isEditing ? "bg-muted" : ""}
                      />
                    </div>
                  </div>
                  
                  {isEditing && (
                    <div className="flex justify-end gap-2 pt-4">
                      <Button variant="outline" onClick={() => setIsEditing(false)}>
                        Cancel
                      </Button>
                      <Button onClick={handleUpdateProfile} disabled={isSaving}>
                        {isSaving ? 'Saving...' : 'Save Changes'}
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="bookings" className="space-y-6">
              {bookings.length === 0 ? (
                <Card>
                  <CardContent className="py-12 text-center">
                    <Calendar className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                    <h3 className="text-lg font-medium mb-2">No bookings yet</h3>
                    <p className="text-muted-foreground mb-4">
                      You haven't made any bookings. Start planning your journey!
                    </p>
                    <Button onClick={() => navigate('/')}>
                      Book a Bus
                    </Button>
                  </CardContent>
                </Card>
              ) : (
                <div className="space-y-4">
                  {bookings.map((booking) => (
                    <Card key={booking.id}>
                      <CardContent className="p-6">
                        <div className="flex items-start justify-between mb-4">
                          <div>
                            <div className="flex items-center gap-2 mb-2">
                              <h3 className="font-semibold">{booking.booking_reference}</h3>
                              <Badge 
                                variant="secondary" 
                                className={`${getStatusColor(booking.booking_status)} text-white`}
                              >
                                {booking.booking_status}
                              </Badge>
                            </div>
                            <p className="text-sm text-muted-foreground">
                              Booked on {new Date(booking.created_at).toLocaleDateString()}
                            </p>
                          </div>
                          <div className="text-right">
                            <div className="font-bold text-lg">₹{booking.total_amount}</div>
                            <div className="text-sm text-muted-foreground">
                              {booking.payment_status === 'paid' ? 'Paid' : 'Pending'}
                            </div>
                          </div>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                          <div className="flex items-center gap-2">
                            <MapPin className="w-4 h-4 text-muted-foreground" />
                            <div>
                              <div className="font-medium text-sm">
                                {booking.schedule.route.from_city} → {booking.schedule.route.to_city}
                              </div>
                            </div>
                          </div>
                          
                          <div className="flex items-center gap-2">
                            <Calendar className="w-4 h-4 text-muted-foreground" />
                            <div>
                              <div className="font-medium text-sm">
                                {new Date(booking.schedule.journey_date).toLocaleDateString()}
                              </div>
                            </div>
                          </div>
                          
                          <div className="flex items-center gap-2">
                            <Clock className="w-4 h-4 text-muted-foreground" />
                            <div>
                              <div className="font-medium text-sm">
                                {booking.schedule.departure_time} - {booking.schedule.arrival_time}
                              </div>
                            </div>
                          </div>
                          
                          <div className="flex items-center gap-2">
                            <User className="w-4 h-4 text-muted-foreground" />
                            <div>
                              <div className="font-medium text-sm">
                                Seats: {booking.seat_numbers.join(', ')}
                              </div>
                            </div>
                          </div>
                        </div>
                        
                        <Separator className="my-4" />
                        
                        <div className="flex items-center justify-between">
                          <div className="text-sm text-muted-foreground">
                            <div>{booking.schedule.bus.operator}</div>
                            <div>{booking.schedule.bus.bus_type} • {booking.schedule.bus.bus_number}</div>
                          </div>
                          
                          <div className="flex gap-2">
                            <Button variant="outline" size="sm">
                              <Download className="w-4 h-4 mr-2" />
                              Download Ticket
                            </Button>
                            {booking.booking_status === 'confirmed' && (
                              <Button variant="outline" size="sm">
                                Cancel Booking
                              </Button>
                            )}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </div>
      
      <Footer />
    </div>
  )
}

export default Profile