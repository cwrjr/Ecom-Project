import { Link } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { ShoppingBag, ArrowRight, Star, Zap, Shield } from "lucide-react";
import type { Product } from "@shared/schema";
import bannerImage from "@assets/images/pexels-n-voitkevich-6214476.jpg";
import aboutImage from "@assets/images/pexels-karolina-grabowska-5632382.jpg";
import headphonesImage from "@assets/A sleek black pair of premium wireless headphones displayed on a clean white background with soft sh.jpeg";
import chargerImage from "@assets/magicstudio-art (1).jpg";
import investmentImage from "@assets/pexels-alesiakozik-6772024.jpg";
import { Button } from "@/components/ui/button";
import Footer from "@/components/Footer";

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
  return imagePath; // fallback to original path
};

export default function Home() {
  const { data: featuredProducts = [] } = useQuery<Product[]>({
    queryKey: ["/api/products/featured"],
  });

  return (
    <div className="min-h-screen">
      {/* Hero Banner */}
      <section 
        className="relative h-[80vh] flex items-center justify-center bg-cover bg-center"
        style={{ backgroundImage: `url(${bannerImage})` }}
      >
        <div className="absolute inset-0 bg-black bg-opacity-50"></div>
        <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
          <h1 className="text-6xl md:text-8xl font-bold mb-6 bg-gradient-to-r from-blue-400 via-white to-blue-600 bg-clip-text text-transparent">
            Welcome!
          </h1>
          <p className="text-xl md:text-2xl text-white mb-8 font-medium">
            Discover premium products designed with care and precision
          </p>
          <Link href="/shop">
            <Button size="lg" className="text-lg px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-full shadow-lg hover:shadow-xl transition-all duration-200">
              <ShoppingBag className="h-5 w-5 mr-2" />
              Start Shopping
              <ArrowRight className="h-5 w-5 ml-2" />
            </Button>
          </Link>
        </div>
      </section>

      {/* About Trellis Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-4xl font-bold text-blue-600 mb-6 text-center lg:text-left">
                About Trellis
              </h2>
              <p className="text-lg text-gray-700 mb-6 leading-relaxed">
                At Trellis, we believe in creating exceptional products that enhance your everyday life. 
                Our carefully curated collection features premium items designed with precision and crafted 
                with passion. From cutting-edge technology to timeless essentials, every product in our 
                store represents our commitment to quality and innovation.
              </p>
              <p className="text-lg text-gray-700 mb-8 leading-relaxed">
                We understand that our customers deserve the best, which is why we partner with trusted 
                manufacturers and artisans who share our values of excellence, sustainability, and 
                customer satisfaction.
              </p>
              <Link href="/contact">
                <Button variant="outline" size="lg" className="text-blue-600 border-blue-600 hover:bg-blue-600 hover:text-white font-bold">
                  Get in Touch
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              </Link>
            </div>
            <div className="relative">
              <img 
                src={aboutImage} 
                alt="About Trellis" 
                className="rounded-3xl shadow-2xl w-full"
              />
              <div className="absolute -bottom-6 -right-6 bg-blue-600 text-white p-6 rounded-2xl shadow-lg">
                <div className="text-3xl font-bold">500+</div>
                <div className="text-sm">Happy Customers</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-blue-600 mb-4">Featured Products</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Discover our handpicked selection of premium products that combine quality, 
              innovation, and style.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
            {featuredProducts.slice(0, 6).map((product) => (
              <div key={product.id} className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300 overflow-hidden group">
                <div className="relative overflow-hidden">
                  <img 
                    src={getProductImage(product.image, product.name)} 
                    alt={product.name}
                    className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  {product.originalPrice && (
                    <div className="absolute top-4 left-4 bg-red-500 text-white px-3 py-1 rounded-full text-sm font-bold">
                      SALE
                    </div>
                  )}
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-2">{product.name}</h3>
                  <p className="text-gray-600 mb-4 line-clamp-2">{product.description}</p>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      {product.originalPrice && (
                        <span className="text-gray-400 line-through">${product.originalPrice}</span>
                      )}
                      <span className="text-2xl font-bold text-blue-600">${product.price}</span>
                    </div>
                    <div className="flex items-center">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center">
            <Link href="/shop">
              <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-8 py-4">
                View All Products
                <ArrowRight className="h-5 w-5 ml-2" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Why Choose Trellis */}
      <section className="py-20 bg-blue-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-blue-600 mb-4">Why Choose Trellis?</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              We're committed to providing an exceptional shopping experience with every purchase.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center p-8 bg-white rounded-2xl shadow-lg">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Zap className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">Fast Delivery</h3>
              <p className="text-gray-600">
                Get your orders delivered quickly with our expedited shipping options and reliable logistics partners.
              </p>
            </div>

            <div className="text-center p-8 bg-white rounded-2xl shadow-lg">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Shield className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">Quality Guarantee</h3>
              <p className="text-gray-600">
                Every product is carefully inspected and comes with our satisfaction guarantee for your peace of mind.
              </p>
            </div>

            <div className="text-center p-8 bg-white rounded-2xl shadow-lg">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Star className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">Premium Support</h3>
              <p className="text-gray-600">
                Our dedicated customer service team is here to help you with any questions or concerns you may have.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-20 bg-blue-600">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold text-white mb-6">
            Ready to Experience Excellence?
          </h2>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            Join thousands of satisfied customers who trust Trellis for their premium product needs.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/shop">
              <Button size="lg" variant="secondary" className="bg-white text-blue-600 hover:bg-gray-100 font-bold px-8 py-4">
                <ShoppingBag className="h-5 w-5 mr-2" />
                Shop Now
              </Button>
            </Link>
            <Link href="/contact">
              <Button size="lg" className="bg-white text-blue-600 hover:bg-gray-100 font-bold px-8 py-4 border-2 border-white">
                Contact Us
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}