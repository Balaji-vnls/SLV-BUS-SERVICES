import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar, MapPin, Users, Search } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const SearchForm = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [searchData, setSearchData] = useState({
    from: '',
    to: '',
    date: '',
    passengers: '1'
  });

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!searchData.from || !searchData.to || !searchData.date) {
      toast({
        title: "Please fill all fields",
        description: "From, To, and Date are required to search buses.",
        variant: "destructive"
      });
      return;
    }

    const searchParams = new URLSearchParams({
      from: searchData.from,
      to: searchData.to,
      date: searchData.date,
      passengers: searchData.passengers
    });

    navigate(`/search?${searchParams.toString()}`);
  };

  return (
    <Card className="p-6 bg-card shadow-card">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <div className="space-y-2">
          <Label htmlFor="from" className="text-sm font-medium text-foreground">From</Label>
          <div className="relative">
            <MapPin className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              id="from"
              placeholder="Departure city"
              className="pl-10"
            />
          </div>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="to" className="text-sm font-medium text-foreground">To</Label>
          <div className="relative">
            <MapPin className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              id="to"
              placeholder="Destination city"
              className="pl-10"
            />
          </div>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="date" className="text-sm font-medium text-foreground">Journey Date</Label>
          <div className="relative">
            <Calendar className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              id="date"
              type="date"
              className="pl-10"
            />
          </div>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="passengers" className="text-sm font-medium text-foreground">Passengers</Label>
          <Select>
            <SelectTrigger>
              <div className="flex items-center">
                <Users className="h-4 w-4 mr-2 text-muted-foreground" />
                <SelectValue placeholder="Select" />
              </div>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1">1 Passenger</SelectItem>
              <SelectItem value="2">2 Passengers</SelectItem>
              <SelectItem value="3">3 Passengers</SelectItem>
              <SelectItem value="4">4 Passengers</SelectItem>
              <SelectItem value="5">5+ Passengers</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div className="flex items-end">
          <Button className="w-full h-10 bg-gradient-primary hover:opacity-90 transition-opacity">
            <Search className="w-4 h-4 mr-2" />
            Search Buses
          </Button>
        </div>
      </div>
    </Card>
  );
};

export default SearchForm;