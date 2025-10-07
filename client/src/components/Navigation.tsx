import { Link, useLocation } from "wouter";
import { useState } from "react";
import { Menu, X, ShoppingBag, Phone, Home, ShoppingCart, Search } from "lucide-react";
import { useCart } from "./CartContext";
import logoPath from "@assets/images/logi.webp";

export default function Navigation() {
  const [location, navigate] = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const { cartCount } = useCart();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/shop?search=${encodeURIComponent(searchQuery)}`);
      setSearchQuery("");
    }
  };

  const navigation = [
    { name: "Home", href: "/", icon: Home },
    { name: "Shop", href: "/shop", icon: ShoppingBag },
    { name: "Contact", href: "/contact", icon: Phone },
  ];

  return (
    <nav className="bg-white shadow-lg border-b-4 border-blue-600 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          <div className="flex items-center space-x-6">
            <Link href="/">
              <img 
                src={logoPath} 
                alt="Trellis Logo" 
                className="h-12 w-auto hover:opacity-80 transition-opacity"
              />
            </Link>
            
            {/* Search Bar - Desktop */}
            <form onSubmit={handleSearch} className="hidden lg:flex items-center">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search products..."
                  className="pl-10 pr-4 py-2 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-blue-600 w-64 transition-all"
                />
              </div>
            </form>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-4">
            {navigation.map((item) => {
              const Icon = item.icon;
              const isActive = location === item.href;
              return (
                <Link key={item.name} href={item.href}
                  className={`flex items-center space-x-2 px-4 py-3 rounded-lg text-lg font-bold transition-all duration-200 ${
                    isActive
                      ? "bg-blue-600 text-white shadow-lg"
                      : "text-blue-600 hover:bg-blue-50 hover:shadow-md border-2 border-transparent hover:border-blue-600"
                  }`}
                >
                  <Icon className="h-5 w-5" />
                  <span>{item.name}</span>
                </Link>
              );
            })}
            
            {/* Cart Icon */}
            <Link href="/cart" className="relative flex items-center space-x-2 px-4 py-3 rounded-lg text-lg font-bold text-blue-600 hover:bg-blue-50 hover:shadow-md border-2 border-transparent hover:border-blue-600 transition-all duration-200">
              <ShoppingCart className="h-5 w-5" />
              <span>Cart</span>
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-6 w-6 flex items-center justify-center font-bold">
                  {cartCount}
                </span>
              )}
            </Link>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center space-x-4">
            <Link href="/cart" className="relative p-2">
              <ShoppingCart className="h-6 w-6 text-blue-600" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-bold">
                  {cartCount}
                </span>
              )}
            </Link>
            
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-blue-600 hover:text-blue-700 focus:outline-none"
            >
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-gray-200">
            {/* Search Bar - Mobile */}
            <form onSubmit={handleSearch} className="mb-4 px-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search products..."
                  className="w-full pl-10 pr-4 py-2 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-blue-600 transition-all"
                />
              </div>
            </form>
            
            <div className="flex flex-col space-y-2">
              {navigation.map((item) => {
                const Icon = item.icon;
                const isActive = location === item.href;
                return (
                  <Link key={item.name} href={item.href}>
                    <a
                      className={`flex items-center space-x-3 px-4 py-3 rounded-lg text-lg font-bold transition-all ${
                        isActive
                          ? "bg-blue-600 text-white"
                          : "text-blue-600 hover:bg-blue-50"
                      }`}
                      onClick={() => setIsMenuOpen(false)}
                    >
                      <Icon className="h-5 w-5" />
                      <span>{item.name}</span>
                    </a>
                  </Link>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}