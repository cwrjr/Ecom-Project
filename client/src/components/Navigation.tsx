import { Link, useLocation } from "wouter";
import { useState } from "react";
import { Menu, X, ShoppingBag, Phone, Home, ShoppingCart, Search, Moon, Sun } from "lucide-react";
import { useCart } from "./CartContext";
import { useTheme } from "./ThemeProvider";
import logoPath from "@assets/images/logi.webp";
import { motion, AnimatePresence } from "framer-motion";

export default function Navigation() {
  const [location, navigate] = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const { cartCount } = useCart();
  const { theme, toggleTheme } = useTheme();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/shop?search=${encodeURIComponent(searchQuery)}`);
      setSearchQuery("");
      setIsMenuOpen(false);
    }
  };

  const navigation = [
    { name: "Home", href: "/", icon: Home },
    { name: "Shop", href: "/shop", icon: ShoppingBag },
    { name: "Contact", href: "/contact", icon: Phone },
  ];

  return (
    <nav className="bg-white/90 dark:bg-gray-900/90 backdrop-blur-xl shadow-lg border-b-4 border-blue-600 dark:border-blue-500 sticky top-0 z-50">
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
              <div className="relative group">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search products..."
                  className="pl-10 pr-20 py-2 border-2 border-gray-200 dark:border-gray-600 rounded-lg focus:outline-none focus:border-blue-600 w-64 transition-all dark:bg-gray-800 dark:text-white"
                />
                <kbd className="absolute right-3 top-1/2 transform -translate-y-1/2 px-2 py-0.5 text-xs text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded">
                  ⌘K
                </kbd>
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
                  className={`flex items-center space-x-2 px-4 py-3 rounded-lg text-lg font-bold transition-all duration-300 ${
                    isActive
                      ? "bg-blue-600 text-white shadow-lg hover:shadow-blue-500/50"
                      : "text-blue-600 hover:bg-blue-50 hover:shadow-md hover:shadow-blue-500/20 border-2 border-transparent hover:border-blue-600"
                  }`}
                >
                  <Icon className="h-5 w-5" />
                  <span>{item.name}</span>
                </Link>
              );
            })}
            
            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="p-3 rounded-lg text-blue-600 hover:bg-blue-50 hover:shadow-md hover:shadow-blue-500/20 border-2 border-transparent hover:border-blue-600 transition-all duration-300"
              aria-label="Toggle theme"
            >
              {theme === "light" ? <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5" />}
            </button>
            
            {/* Cart Icon */}
            <Link href="/cart" className="relative flex items-center space-x-2 px-4 py-3 rounded-lg text-lg font-bold text-blue-600 hover:bg-blue-50 hover:shadow-md hover:shadow-blue-500/20 border-2 border-transparent hover:border-blue-600 transition-all duration-300">
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
            <button
              onClick={toggleTheme}
              className="p-2 text-blue-600 dark:text-blue-400"
              aria-label="Toggle theme"
            >
              {theme === "light" ? <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5" />}
            </button>
            
            <Link href="/cart" className="relative p-2">
              <ShoppingCart className="h-6 w-6 text-blue-600 dark:text-blue-400" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-bold">
                  {cartCount}
                </span>
              )}
            </Link>
            
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-blue-600 dark:text-blue-400 hover:text-blue-700 focus:outline-none"
            >
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
              className="md:hidden overflow-hidden border-t border-gray-200 dark:border-gray-700 bg-white/95 dark:bg-gray-900/95 backdrop-blur-md"
            >
              <div className="py-4">
                {/* Search Bar - Mobile */}
                <motion.form
                  initial={{ y: -20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.1, duration: 0.3 }}
                  onSubmit={handleSearch}
                  className="mb-4 px-4"
                >
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Search products..."
                      className="w-full pl-10 pr-4 py-2 border-2 border-gray-200 dark:border-gray-600 rounded-lg focus:outline-none focus:border-blue-600 dark:bg-gray-800 dark:text-white transition-all"
                      data-testid="input-search-mobile"
                    />
                  </div>
                </motion.form>
                
                <div className="flex flex-col space-y-2">
                  {navigation.map((item, index) => {
                    const Icon = item.icon;
                    const isActive = location === item.href;
                    return (
                      <motion.div
                        key={item.name}
                        initial={{ x: -20, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        transition={{ delay: 0.1 + index * 0.1, duration: 0.3 }}
                      >
                        <Link 
                          href={item.href}
                          className={`flex items-center space-x-3 px-4 py-3 rounded-lg text-lg font-bold transition-all ${
                            isActive
                              ? "bg-blue-600 text-white"
                              : "text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-gray-800"
                          }`}
                          onClick={() => setIsMenuOpen(false)}
                          data-testid={`link-mobile-${item.name.toLowerCase()}`}
                        >
                          <Icon className="h-5 w-5" />
                          <span>{item.name}</span>
                        </Link>
                      </motion.div>
                    );
                  })}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </nav>
  );
}