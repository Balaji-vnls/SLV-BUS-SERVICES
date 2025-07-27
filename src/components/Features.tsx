import { Card } from "@/components/ui/card";
import { Shield, Clock, MapPin, Headphones, CreditCard, Star } from "lucide-react";

const Features = () => {
  const features = [
    {
      icon: <Shield className="w-8 h-8 text-brand-green" />,
      title: "Safe & Secure",
      description: "All our buses are GPS tracked and follow strict safety protocols"
    },
    {
      icon: <Clock className="w-8 h-8 text-primary" />,
      title: "On-Time Service",
      description: "98% on-time performance with real-time tracking updates"
    },
    {
      icon: <MapPin className="w-8 h-8 text-accent" />,
      title: "Extensive Network",
      description: "Connect to 500+ destinations across South India"
    },
    {
      icon: <Headphones className="w-8 h-8 text-brand-orange" />,
      title: "24/7 Support",
      description: "Round-the-clock customer service for all your travel needs"
    },
    {
      icon: <CreditCard className="w-8 h-8 text-brand-blue" />,
      title: "Easy Payments",
      description: "Multiple payment options including UPI, cards, and wallets"
    },
    {
      icon: <Star className="w-8 h-8 text-yellow-500" />,
      title: "Premium Quality",
      description: "Comfortable seating, AC, and modern amenities in every bus"
    }
  ];

  return (
    <section className="py-16 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-foreground mb-4">Why Choose Sri Lakshmi Venkateshwara?</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Experience the best in bus travel with our commitment to safety, comfort, and reliability
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <Card key={index} className="p-6 text-center hover:shadow-card transition-shadow duration-300">
              <div className="flex justify-center mb-4">
                <div className="p-3 bg-secondary rounded-full">
                  {feature.icon}
                </div>
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-2">{feature.title}</h3>
              <p className="text-muted-foreground">{feature.description}</p>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;