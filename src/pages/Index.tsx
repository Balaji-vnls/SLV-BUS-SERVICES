import Header from "@/components/Header";
import SearchForm from "@/components/SearchForm";
import BusCard from "@/components/BusCard";
import PopularRoutes from "@/components/PopularRoutes";
import Features from "@/components/Features";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Star, ArrowRight } from "lucide-react";
import heroBus from "@/assets/hero-bus.jpg";

const Index = () => {
  // Sample bus data - will be replaced with real data when backend is connected
  const sampleBuses = [
    {
      operator: "Sri Lakshmi Venkateshwara",
      busType: "AC Sleeper",
      departureTime: "22:00",
      arrivalTime: "06:00",
      duration: "8h 0m",
      price: 650,
      rating: 4.5,
      seatsAvailable: 12,
      amenities: ["WiFi", "TV", "Charging"]
    },
    {
      operator: "Sri Lakshmi Venkateshwara",
      busType: "AC Semi-Sleeper",
      departureTime: "23:30",
      arrivalTime: "07:30",
      duration: "8h 0m",
      price: 550,
      rating: 4.3,
      seatsAvailable: 8,
      amenities: ["WiFi", "Charging"]
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      {/* Hero Section */}
      <section className="relative h-[600px] flex items-center justify-center overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: `url(${heroBus})` }}
        >
          <div className="absolute inset-0 bg-gradient-hero opacity-80"></div>
        </div>
        
        <div className="relative z-10 text-center text-white px-4">
          <h1 className="text-4xl md:text-6xl font-bold mb-4">
            Travel in Comfort & Style
          </h1>
          <p className="text-xl md:text-2xl mb-8 opacity-90">
            Book your bus tickets with Sri Lakshmi Venkateshwara Bus Services
          </p>
          <div className="flex items-center justify-center space-x-2 mb-8">
            <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
            <span className="text-lg font-medium">4.5 Rating</span>
            <span className="opacity-75">• 50,000+ Happy Customers</span>
          </div>
        </div>
      </section>
      
      {/* Search Section */}
      <section className="py-8 -mt-20 relative z-20">
        <div className="container mx-auto px-4">
          <SearchForm />
        </div>
      </section>
      
      {/* Sample Bus Results */}
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-3xl font-bold text-foreground mb-2">Available Buses</h2>
              <p className="text-muted-foreground">Choose from our premium bus services</p>
            </div>
            <Button variant="outline">
              View All <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
          
          <div className="space-y-4">
            {sampleBuses.map((bus, index) => (
              <BusCard key={index} {...bus} />
            ))}
          </div>
        </div>
      </section>
      
      <PopularRoutes />
      <Features />
      <Footer />
    </div>
  );
};

export default Index;
