import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MapPin, TrendingUp } from "lucide-react";

const PopularRoutes = () => {
  const routes = [
    { from: "Hyderabad", to: "Bangalore", price: "₹650", discount: "15% OFF" },
    { from: "Chennai", to: "Coimbatore", price: "₹450", discount: "10% OFF" },
    { from: "Vijayawada", to: "Visakhapatnam", price: "₹380", discount: "20% OFF" },
    { from: "Tirupati", to: "Chennai", price: "₹320", discount: "12% OFF" },
    { from: "Bangalore", to: "Mysore", price: "₹180", discount: "8% OFF" },
    { from: "Guntur", to: "Hyderabad", price: "₹420", discount: "18% OFF" }
  ];

  return (
    <section className="py-16 bg-secondary/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <TrendingUp className="w-6 h-6 text-primary" />
            <h2 className="text-3xl font-bold text-foreground">Popular Routes</h2>
          </div>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Discover our most traveled routes with the best prices and offers
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {routes.map((route, index) => (
            <Card key={index} className="p-6 hover:shadow-card transition-shadow duration-300 cursor-pointer group">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-2">
                  <MapPin className="w-5 h-5 text-primary" />
                  <span className="font-medium text-foreground">{route.from}</span>
                </div>
                <Badge variant="secondary" className="bg-brand-orange-light text-primary">
                  {route.discount}
                </Badge>
              </div>
              
              <div className="flex items-center justify-center py-2">
                <div className="w-full border-t border-dashed border-border relative">
                  <div className="absolute inset-x-0 -top-3 flex justify-center">
                    <div className="bg-card px-2">
                      <span className="text-sm text-muted-foreground">to</span>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <MapPin className="w-5 h-5 text-accent" />
                  <span className="font-medium text-foreground">{route.to}</span>
                </div>
                <div className="text-right">
                  <p className="text-lg font-bold text-primary">Starting {route.price}</p>
                  <p className="text-xs text-muted-foreground">per person</p>
                </div>
              </div>
              
              <div className="mt-4 text-center">
                <span className="text-sm text-accent group-hover:text-primary transition-colors">
                  View Schedules →
                </span>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PopularRoutes;