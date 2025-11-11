import { Link } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useRef, useState } from "react";
import { ShoppingBag, ArrowRight, Star, Zap, Shield, Phone } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import type { Product } from "@shared/schema";
import bannerImage from "@assets/images/pexels-n-voitkevich-6214476.jpg";
import aboutImage from "@assets/images/pexels-karolina-grabowska-5632382.jpg";
import headphonesImage from "@assets/A sleek black pair of premium wireless headphones displayed on a clean white background with soft sh.jpeg";
import chargerImage from "@assets/magicstudio-art (1).jpg";
import investmentImage from "@assets/pexels-alesiakozik-6772024.jpg";
import smartHomeVideo from "@assets/f62dd8e7-7056-4c64-9252-8cb45c3210ef (1).mp4";
import monitorImage from "@assets/minimalist_expensive_desk_with_curved_monitor_that.jpg";
import { Button } from "@/components/ui/button";
import Footer from "@/components/Footer";
import ProductRating from "@/components/ProductRating";
import { SEO } from "@/components/SEO";
import { NewsletterModal } from "@/components/NewsletterModal";

// Image resolver to map product images to actual imported assets
const getProductImage = (imagePath: string, productName: string) => {
  if (productName === "Premium Wireless Headphones") {
    return headphonesImage;
  }
  if (productName === "Wireless Phone Charger") {
    return chargerImage;
  }
  if (productName === "Investment Trends") {
    return investmentImage;
  }
  if (productName === "Smart Home Assistant") {
    return smartHomeVideo;
  }
  if (productName === "Monitors") {
    return monitorImage;
  }
  return imagePath; // fallback to original path
};

export default function Home() {
  const { data: featuredProducts = [] } = useQuery<Product[]>({
    queryKey: ["/api/products/featured"],
  });

  const [isWhyChooseVisible, setIsWhyChooseVisible] = useState(false);
  const [scrollLocked, setScrollLocked] = useState(false);
  const [newsletterModalOpen, setNewsletterModalOpen] = useState(false);
  const whyChooseRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !isWhyChooseVisible) {
            setIsWhyChooseVisible(true);
            setScrollLocked(true);
            document.body.style.overflow = 'hidden';
            document.documentElement.style.overflow = 'hidden';
            
            // Prevent all scroll events during lock
            const preventScroll = (e: Event) => {
              e.preventDefault();
              e.stopPropagation();
              return false;
            };
            
            document.addEventListener('wheel', preventScroll, { passive: false });
            document.addEventListener('touchmove', preventScroll, { passive: false });
            document.addEventListener('keydown', (e) => {
              if ([32, 33, 34, 35, 36, 37, 38, 39, 40].includes(e.keyCode)) {
                e.preventDefault();
              }
            });
            
            setTimeout(() => {
              setScrollLocked(false);
              document.body.style.overflow = 'unset';
              document.documentElement.style.overflow = 'unset';
              document.removeEventListener('wheel', preventScroll);
              document.removeEventListener('touchmove', preventScroll);
            }, 3000);
          }
        });
      },
      { threshold: 0.8 }
    );

    if (whyChooseRef.current) {
      observer.observe(whyChooseRef.current);
    }

    return () => {
      observer.disconnect();
      document.body.style.overflow = 'unset';
    };
  }, [isWhyChooseVisible]);

  useEffect(() => {
    const hasSeenNewsletter = localStorage.getItem('newsletterSeen');
    
    if (!hasSeenNewsletter) {
      const timer = setTimeout(() => {
        setNewsletterModalOpen(true);
        localStorage.setItem('newsletterSeen', 'true');
      }, 8000);

      return () => clearTimeout(timer);
    }
  }, []);

  return (
    <div className="min-h-screen relative">
      <SEO 
        title="Trellis - Premium E-commerce Platform"
        description="Discover premium products at Trellis. Shop our curated collection of electronics, accessories, and innovative tech solutions with fast shipping and excellent customer service."
        type="website"
      />
      {/* Hero Banner */}
      <section 
        className="relative h-[80vh] flex items-center justify-center bg-cover bg-center bg-fixed"
        style={{ backgroundImage: `url(${bannerImage})` }}
      >
        <div className="absolute inset-0 bg-black/30"></div>
        <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
          <h1 className="text-6xl md:text-8xl font-bold mb-6 bg-gradient-to-r from-slate-100 via-blue-100 to-slate-100 bg-clip-text text-transparent animate-gradient-text">
            Welcome!
          </h1>
          <p className="text-xl md:text-2xl text-white mb-8 font-medium backdrop-blur-sm bg-white/10 rounded-lg p-4">
            Discover premium products designed with care and precision
          </p>
          <Link href="/shop">
            <Button size="lg" className="btn-glass text-white font-bold text-lg px-8 py-4 rounded-full">
              <ShoppingBag className="h-5 w-5 mr-2" />
              Start Shopping
              <ArrowRight className="h-5 w-5 ml-2" />
            </Button>
          </Link>
        </div>
      </section>

      {/* About Trellis Section */}
      <section id="about" className="py-20 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div className="glass-card p-8">
              <h2 className="text-4xl font-bold text-blue-600 dark:text-blue-400 mb-6 text-center lg:text-left">
                About Trellis
              </h2>
              <p className="text-lg text-gray-700 dark:text-gray-200 mb-6 leading-relaxed">
                At Trellis, we believe in creating exceptional products that enhance your everyday life. 
                Our carefully curated collection features premium items designed with precision and crafted 
                with passion. From cutting-edge technology to timeless essentials, every product in our 
                store represents our commitment to quality and innovation.
              </p>
              <p className="text-lg text-gray-700 dark:text-gray-200 mb-8 leading-relaxed">
                We understand that our customers deserve the best, which is why we partner with trusted 
                manufacturers and artisans who share our values of excellence, sustainability, and 
                customer satisfaction.
              </p>
              <Link href="/contact">
                <Button variant="outline" size="lg" className="text-blue-600 border-blue-600 hover:bg-blue-600 hover:text-white font-bold hover:shadow-lg hover:shadow-blue-500/50 transition-all duration-300">
                  Get in Touch
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              </Link>
            </div>
            <div className="relative reveal-on-hover">
              <img 
                src={aboutImage} 
                alt="About Trellis"
                loading="lazy" 
                className="rounded-3xl shadow-2xl w-full smooth-transition"
              />
              <div className="absolute -bottom-6 -right-6 glass-card text-white p-6 reveal-content">
                <div className="text-3xl font-bold">500+</div>
                <div className="text-sm">Happy Customers</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-20 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-blue-600 dark:text-blue-400 mb-4">Featured Products</h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto glass-card p-6">
              Discover our handpicked selection of premium products that combine quality, 
              innovation, and style.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
            {featuredProducts.slice(0, 6).map((product) => (
              <div key={product.id} className="product-card">
                <div className="relative overflow-hidden">
                  {product.name === "Smart Home Assistant" ? (
                    <video
                      src={getProductImage(product.image, product.name)}
                      className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300"
                      autoPlay
                      loop
                      muted
                      playsInline
                    />
                  ) : (
                    <img 
                      src={getProductImage(product.image, product.name)} 
                      alt={product.name}
                      loading="lazy"
                      className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  )}
                  {product.originalPrice && (
                    <div className="absolute top-4 left-4 bg-red-500 text-white px-3 py-1 rounded-full text-sm font-bold">
                      SALE
                    </div>
                  )}
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">{product.name}</h3>
                  <p className="text-gray-600 dark:text-gray-300 mb-4 line-clamp-2">{product.description}</p>
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-2">
                      {product.originalPrice && (
                        <span className="text-gray-400 dark:text-gray-500 line-through">${product.originalPrice}</span>
                      )}
                      <span className="text-2xl font-bold text-blue-600 dark:text-blue-400">${product.price}</span>
                    </div>
                  </div>
                  <ProductRating productId={product.id} productName={product.name} />
                </div>
              </div>
            ))}
          </div>

          <div className="text-center">
            <Link href="/shop" onClick={() => window.scrollTo(0, 0)}>
              <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-8 py-4 hover:shadow-lg hover:shadow-blue-500/50 transition-all duration-300">
                View All Products
                <ArrowRight className="h-5 w-5 ml-2" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Why Choose Trellis */}
      <section 
        ref={whyChooseRef}
        className="py-20 bg-gradient-to-r from-blue-600/20 to-purple-600/20 backdrop-blur-lg relative overflow-hidden animate-gradient-x"
      >
        <div className={`absolute inset-0 bg-white/10 backdrop-blur-sm transition-opacity duration-2000 ${
          scrollLocked ? 'opacity-100' : 'opacity-0'
        }`}></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className={`text-center mb-16 transform transition-all duration-1000 ${
            isWhyChooseVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
          }`}>
            <h2 className="text-4xl font-bold text-blue-600 dark:text-blue-400 mb-4">Why Choose Trellis?</h2>
            <p className="text-xl text-gray-700 dark:text-gray-200 max-w-2xl mx-auto bg-white/20 backdrop-blur-md rounded-2xl border border-white/30 shadow-xl p-6">
              We're committed to providing an exceptional shopping experience with every purchase.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className={`text-center p-8 bg-white/20 backdrop-blur-md rounded-2xl border border-white/30 shadow-xl transform transition-all duration-1000 hover:scale-105 hover:bg-white/30 ${
              scrollLocked 
                ? 'delay-300 animate-bounce' 
                : isWhyChooseVisible 
                  ? 'translate-y-0 opacity-100 scale-100 delay-300' 
                  : 'translate-y-16 opacity-0 scale-95'
            }`}>
              <div className={`w-16 h-16 bg-blue-600/30 rounded-full flex items-center justify-center mx-auto mb-6 backdrop-blur-sm transition-all duration-500 relative ${
                scrollLocked ? 'animate-pulse scale-110' : ''
              }`}>
                <Zap className="h-8 w-8 text-blue-600" />
                <AnimatePresence>
                  {isWhyChooseVisible && (
                    <motion.div
                      initial={{ scale: 0, rotate: -180 }}
                      animate={{ scale: 1, rotate: 0 }}
                      transition={{ duration: 0.5, type: "spring", stiffness: 200 }}
                      className="absolute inset-0 flex items-center justify-center"
                    >
                      <Zap className="h-6 w-6 text-yellow-400 animate-pulse drop-shadow-[0_0_8px_rgba(250,204,21,0.8)]" />
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
              <h3 className={`text-xl font-bold text-gray-900 dark:text-white mb-4 transition-all duration-500 ${
                scrollLocked ? 'animate-pulse' : ''
              }`}>Fast Delivery</h3>
              <p className="text-gray-600 dark:text-gray-300">
                Get your orders delivered quickly with our expedited shipping options and reliable logistics partners.
              </p>
            </div>

            <div className={`text-center p-8 bg-white/20 backdrop-blur-md rounded-2xl border border-white/30 shadow-xl transform transition-all duration-1000 hover:scale-105 hover:bg-white/30 ${
              scrollLocked 
                ? 'delay-500 animate-bounce' 
                : isWhyChooseVisible 
                  ? 'translate-y-0 opacity-100 scale-100 delay-500' 
                  : 'translate-y-16 opacity-0 scale-95'
            }`}>
              <div className={`w-16 h-16 bg-blue-600/30 rounded-full flex items-center justify-center mx-auto mb-6 backdrop-blur-sm transition-all duration-500 relative ${
                scrollLocked ? 'animate-pulse scale-110' : ''
              }`}>
                <Shield className="h-8 w-8 text-blue-600" />
                <AnimatePresence>
                  {isWhyChooseVisible && (
                    <motion.div
                      initial={{ scale: 0, opacity: 0, y: -10 }}
                      animate={{ scale: 1, opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, type: "spring", stiffness: 200, delay: 0.2 }}
                      className="absolute inset-0 flex items-center justify-center"
                    >
                      <span className="text-3xl font-black text-blue-600 dark:text-blue-400 drop-shadow-[0_0_6px_rgba(37,99,235,0.8)] animate-pulse">
                        T
                      </span>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
              <h3 className={`text-xl font-bold text-gray-900 dark:text-white mb-4 transition-all duration-500 ${
                scrollLocked ? 'animate-pulse' : ''
              }`}>Quality Guarantee</h3>
              <p className="text-gray-600 dark:text-gray-300">
                Every product is carefully inspected and comes with our satisfaction guarantee for your peace of mind.
              </p>
            </div>

            <div className={`text-center p-8 bg-white/20 backdrop-blur-md rounded-2xl border border-white/30 shadow-xl transform transition-all duration-1000 hover:scale-105 hover:bg-white/30 ${
              scrollLocked 
                ? 'delay-700 animate-bounce' 
                : isWhyChooseVisible 
                  ? 'translate-y-0 opacity-100 scale-100 delay-700' 
                  : 'translate-y-16 opacity-0 scale-95'
            }`}>
              <div className={`w-16 h-16 bg-blue-600/30 rounded-full flex items-center justify-center mx-auto mb-6 backdrop-blur-sm transition-all duration-500 relative ${
                scrollLocked ? 'animate-pulse scale-110' : ''
              }`}>
                <Star className="h-8 w-8 text-blue-600" />
                <AnimatePresence>
                  {isWhyChooseVisible && (
                    <motion.div
                      initial={{ scale: 0, rotate: -180 }}
                      animate={{ scale: 1, rotate: 0 }}
                      transition={{ duration: 0.5, type: "spring", stiffness: 200, delay: 0.4 }}
                      className="absolute inset-0 flex items-center justify-center"
                    >
                      <Zap className="h-6 w-6 text-yellow-400 animate-pulse drop-shadow-[0_0_8px_rgba(250,204,21,0.8)]" />
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
              <h3 className={`text-xl font-bold text-gray-900 dark:text-white mb-4 transition-all duration-500 ${
                scrollLocked ? 'animate-pulse' : ''
              }`}>Premium Support</h3>
              <p className="text-gray-600 dark:text-gray-300">
                Our dedicated customer service team is here to help you with any questions or concerns you may have.
              </p>
            </div>
          </div>
          
          {scrollLocked && (
            <div className="absolute inset-0 pointer-events-none">
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-white/60 text-sm font-medium animate-pulse backdrop-blur-sm bg-black/20 px-4 py-2 rounded-lg">
                Experiencing Trellis...
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-20 bg-gradient-to-r from-blue-600 via-blue-500 to-purple-600 relative overflow-hidden animate-gradient-x">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-500/30 via-indigo-500/30 to-purple-500/30 animate-gradient-x-reverse"></div>
        <div className="relative max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-center mb-6">
            <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mr-4 backdrop-blur-sm">
              <Star className="h-8 w-8 text-white" />
            </div>
            <h2 className="text-4xl font-bold text-white">
              Ready to Experience Excellence?
            </h2>
          </div>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            Join thousands of satisfied customers who trust Trellis for their premium product needs.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/shop">
              <Button size="lg" variant="secondary" className="bg-white/90 backdrop-blur-sm text-blue-600 hover:bg-white hover:text-blue-700 font-bold px-8 py-4 shadow-lg">
                <ShoppingBag className="h-5 w-5 mr-2" />
                Shop Now
              </Button>
            </Link>
            <Link href="/contact" onClick={() => window.scrollTo(0, 0)}>
              <Button size="lg" className="bg-white/10 backdrop-blur-sm text-white hover:bg-white/20 font-bold px-8 py-4 border-2 border-white/60 shadow-lg">
                <Phone className="h-5 w-5 mr-2" />
                Contact Us
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <Footer />
      
      <NewsletterModal 
        open={newsletterModalOpen} 
        onOpenChange={setNewsletterModalOpen} 
      />
    </div>
  );
}