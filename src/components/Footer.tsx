import { MapPin, Phone, Mail, Clock } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-foreground text-background">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-10 h-10 bg-gradient-primary rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">SL</span>
              </div>
              <div>
                <h3 className="text-lg font-bold">Sri Lakshmi Venkateshwara</h3>
                <p className="text-sm opacity-80">Bus Services</p>
              </div>
            </div>
            <p className="text-sm opacity-80 mb-4">
              Your trusted travel partner for comfortable and safe journeys across South India since 1995.
            </p>
          </div>
          
          <div>
            <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2 text-sm opacity-80">
              <li><a href="#" className="hover:opacity-100 transition-opacity">Book Tickets</a></li>
              <li><a href="#" className="hover:opacity-100 transition-opacity">Cancel Booking</a></li>
              <li><a href="#" className="hover:opacity-100 transition-opacity">Track Bus</a></li>
              <li><a href="#" className="hover:opacity-100 transition-opacity">Route Information</a></li>
              <li><a href="#" className="hover:opacity-100 transition-opacity">Terms & Conditions</a></li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-lg font-semibold mb-4">Contact Info</h4>
            <div className="space-y-3 text-sm opacity-80">
              <div className="flex items-center space-x-2">
                <Phone className="w-4 h-4" />
                <span>+91 98765 43210</span>
              </div>
              <div className="flex items-center space-x-2">
                <Mail className="w-4 h-4" />
                <span>info@srilakshmivenkateshwara.com</span>
              </div>
              <div className="flex items-start space-x-2">
                <MapPin className="w-4 h-4 mt-1" />
                <span>123 Bus Stand Road, Vijayawada, Andhra Pradesh 520001</span>
              </div>
            </div>
          </div>
          
          <div>
            <h4 className="text-lg font-semibold mb-4">Office Hours</h4>
            <div className="space-y-3 text-sm opacity-80">
              <div className="flex items-center space-x-2">
                <Clock className="w-4 h-4" />
                <div>
                  <p>Mon - Sat: 6:00 AM - 10:00 PM</p>
                  <p>Sunday: 7:00 AM - 9:00 PM</p>
                </div>
              </div>
            </div>
            
            <div className="mt-6">
              <h5 className="font-semibold mb-2">Follow Us</h5>
              <div className="flex space-x-3">
                <a href="#" className="w-8 h-8 bg-primary rounded-full flex items-center justify-center hover:bg-accent transition-colors">
                  <span className="text-xs font-bold">f</span>
                </a>
                <a href="#" className="w-8 h-8 bg-primary rounded-full flex items-center justify-center hover:bg-accent transition-colors">
                  <span className="text-xs font-bold">t</span>
                </a>
                <a href="#" className="w-8 h-8 bg-primary rounded-full flex items-center justify-center hover:bg-accent transition-colors">
                  <span className="text-xs font-bold">i</span>
                </a>
              </div>
            </div>
          </div>
        </div>
        
        <div className="border-t border-background/20 mt-8 pt-6 text-center text-sm opacity-80">
          <p>&copy; 2024 Sri Lakshmi Venkateshwara Bus Services. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;