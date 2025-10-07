import { Link } from "wouter";
import { Instagram, Linkedin, Mail, Phone, MapPin } from "lucide-react";
import trellisLogo from "@assets/logi.webp";

export default function Footer() {
  return (
    <footer className="bg-slate-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* About Section */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold mb-4">About Trellis</h3>
            <ul className="space-y-3 text-gray-300">
              <li><a href="/#about" className="hover:text-white transition-colors">Our Story</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Careers</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Press</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Investor Relations</a></li>
            </ul>
          </div>

          {/* Customer Service */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold mb-4">Customer Service</h3>
            <ul className="space-y-3 text-gray-300">
              <li><Link href="/contact" onClick={() => window.scrollTo(0, 0)} className="hover:text-white transition-colors">Contact Us</Link></li>
              <li><a href="/contact#shipping" className="hover:text-white transition-colors">Shipping Information</a></li>
              <li><a href="/contact#shipping" className="hover:text-white transition-colors">Returns & Exchanges</a></li>
              <li><a href="/contact#shipping" className="hover:text-white transition-colors">Track Your Order</a></li>
            </ul>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-3 text-gray-300">
              <li><Link href="/" className="hover:text-white transition-colors">Home</Link></li>
              <li><Link href="/shop" className="hover:text-white transition-colors">Shop</Link></li>
              <li><Link href="/contact" onClick={() => window.scrollTo(0, 0)} className="hover:text-white transition-colors">Contact</Link></li>
              <li><a href="/#about" className="hover:text-white transition-colors">About Us</a></li>
            </ul>
          </div>

          {/* Contact & Social */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold mb-4">Connect</h3>
            <div className="space-y-3 text-gray-300 text-sm">
              <div className="flex items-center space-x-2">
                <Mail className="h-4 w-4" />
                <a href="mailto:Thoma260@wwu.edu" className="hover:text-white transition-colors">
                  Thoma260@wwu.edu
                </a>
              </div>
              <div className="flex items-center space-x-2">
                <Phone className="h-4 w-4" />
                <span>1-800-TRELLIS</span>
              </div>
              <div className="flex items-center space-x-2">
                <MapPin className="h-4 w-4" />
                <a 
                  href="https://www.google.com/maps/dir//Seattle,+WA" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Seattle, WA
                </a>
              </div>
            </div>
            
            <div className="pt-4">
              <p className="text-gray-300 text-sm mb-3">Follow us</p>
              <div className="flex space-x-4">
                <a href="https://instagram.com/cwtjr" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition-colors">
                  <Instagram className="h-5 w-5" />
                </a>
                <a href="https://www.linkedin.com/in/cantrell-thomas-151900266/" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition-colors">
                  <Linkedin className="h-5 w-5" />
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-gray-700 mt-12 pt-8 pb-0">
          <div className="flex flex-col items-center text-center space-y-4">
            <div className="flex items-center space-x-2">
              <img 
                src={trellisLogo} 
                alt="Trellis Logo" 
                className="w-8 h-8 object-contain"
              />
              <span className="text-xl font-bold">Trellis</span>
            </div>
            
            <div className="flex flex-col md:flex-row items-center space-y-2 md:space-y-0 md:space-x-6 text-sm text-gray-400">
              <p>&copy; 2025 Trellis Inc. All rights reserved.</p>
              <div className="flex space-x-4">
                <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
                <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
                <a href="#" className="hover:text-white transition-colors">Cookie Policy</a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}