import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Clock, MapPin, Users, Star, Wifi, Tv, Power } from "lucide-react";

interface BusCardProps {
  operator: string;
  busType: string;
  departureTime: string;
  arrivalTime: string;
  duration: string;
  price: number;
  rating: number;
  seatsAvailable: number;
  amenities: string[];
}

const BusCard = ({
  operator,
  busType,
  departureTime,
  arrivalTime,
  duration,
  price,
  rating,
  seatsAvailable,
  amenities
}: BusCardProps) => {
  const getAmenityIcon = (amenity: string) => {
    switch (amenity.toLowerCase()) {
      case 'wifi':
        return <Wifi className="w-4 h-4" />;
      case 'tv':
        return <Tv className="w-4 h-4" />;
      case 'charging':
        return <Power className="w-4 h-4" />;
      default:
        return null;
    }
  };

  return (
    <Card className="p-6 hover:shadow-elegant transition-shadow duration-300">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center space-y-4 md:space-y-0">
        <div className="flex-1 space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-foreground">{operator}</h3>
              <p className="text-sm text-muted-foreground">{busType}</p>
            </div>
            <div className="flex items-center space-x-1">
              <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
              <span className="text-sm font-medium">{rating}</span>
            </div>
          </div>
          
          <div className="flex items-center space-x-6">
            <div className="text-center">
              <p className="text-xl font-bold text-foreground">{departureTime}</p>
              <p className="text-xs text-muted-foreground">Departure</p>
            </div>
            
            <div className="flex-1 relative">
              <div className="border-t border-dashed border-border"></div>
              <div className="absolute inset-x-0 -top-2 flex justify-center">
                <Badge variant="secondary" className="text-xs">
                  <Clock className="w-3 h-3 mr-1" />
                  {duration}
                </Badge>
              </div>
            </div>
            
            <div className="text-center">
              <p className="text-xl font-bold text-foreground">{arrivalTime}</p>
              <p className="text-xs text-muted-foreground">Arrival</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-1 text-sm text-muted-foreground">
              <Users className="w-4 h-4" />
              <span>{seatsAvailable} seats left</span>
            </div>
            
            <div className="flex items-center space-x-2">
              {amenities.map((amenity, index) => (
                <div key={index} className="flex items-center space-x-1 text-xs text-muted-foreground bg-secondary px-2 py-1 rounded">
                  {getAmenityIcon(amenity)}
                  <span>{amenity}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
        
        <div className="text-right space-y-2">
          <div>
            <p className="text-2xl font-bold text-primary">₹{price}</p>
            <p className="text-xs text-muted-foreground">per person</p>
          </div>
          <Button className="w-full md:w-auto">
            Select Seats
          </Button>
        </div>
      </div>
    </Card>
  );
};

export default BusCard;