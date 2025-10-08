import { Switch, Route, useLocation } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { HelmetProvider } from "react-helmet-async";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Home from "@/pages/Home";
import Shop from "@/pages/Shop";
import Contact from "@/pages/Contact";
import Cart from "@/pages/Cart";
import ProductDetail from "@/pages/ProductDetail";
import NotFound from "@/pages/not-found";
import Navigation from "@/components/Navigation";
import { CartProvider } from "@/components/CartContext";
import { ThemeProvider } from "@/components/ThemeProvider";
import AIChatWidget from "@/components/AIChatWidget";
import { useEffect, useState, useRef } from "react";

function Router() {
  const [location, setLocation] = useLocation();
  const [touchStart, setTouchStart] = useState(0);
  const [touchEnd, setTouchEnd] = useState(0);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const cursorGlowRef = useRef<HTMLDivElement>(null);

  const pages = ["/", "/shop", "/contact", "/cart"];
  const currentIndex = pages.indexOf(location);

  const handleTouchStart = (e: TouchEvent) => {
    setTouchStart(e.targetTouches[0].clientX);
  };

  const handleTouchMove = (e: TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    
    const distance = touchStart - touchEnd;
    const minSwipeDistance = 50;

    if (distance > minSwipeDistance && currentIndex < pages.length - 1) {
      // Swiped left - go to next page
      setLocation(pages[currentIndex + 1]);
    } else if (distance < -minSwipeDistance && currentIndex > 0) {
      // Swiped right - go to previous page
      setLocation(pages[currentIndex - 1]);
    }
  };

  const handleMouseMove = (e: MouseEvent) => {
    setMousePosition({ x: e.clientX, y: e.clientY });
    if (cursorGlowRef.current) {
      cursorGlowRef.current.style.transform = `translate(${e.clientX - 100}px, ${e.clientY - 100}px)`;
    }
  };

  useEffect(() => {
    document.addEventListener('touchstart', handleTouchStart);
    document.addEventListener('touchmove', handleTouchMove);
    document.addEventListener('touchend', handleTouchEnd);
    document.addEventListener('mousemove', handleMouseMove);

    return () => {
      document.removeEventListener('touchstart', handleTouchStart);
      document.removeEventListener('touchmove', handleTouchMove);
      document.removeEventListener('touchend', handleTouchEnd);
      document.removeEventListener('mousemove', handleMouseMove);
    };
  }, [touchStart, touchEnd, currentIndex]);

  return (
    <div className="min-h-screen w-full overflow-x-hidden relative">
      {/* Animated Background */}
      <div className="animated-bg"></div>
      
      {/* Floating Shapes */}
      <div className="floating-shape" style={{ zIndex: -1 }}></div>
      <div className="floating-shape" style={{ zIndex: -1 }}></div>
      <div className="floating-shape" style={{ zIndex: -1 }}></div>
      
      {/* Cursor Glow */}
      <div ref={cursorGlowRef} className="cursor-glow"></div>
      
      <Navigation />
      <div className="w-full relative">
        <Switch>
          <Route path="/" component={Home} />
          <Route path="/shop" component={Shop} />
          <Route path="/product/:id" component={ProductDetail} />
          <Route path="/contact" component={Contact} />
          <Route path="/cart" component={Cart} />
          <Route component={NotFound} />
        </Switch>
      </div>
      <AIChatWidget />
    </div>
  );
}

function App() {
  return (
    <HelmetProvider>
      <QueryClientProvider client={queryClient}>
        <ThemeProvider>
          <TooltipProvider>
            <CartProvider>
              <Toaster />
              <Router />
            </CartProvider>
          </TooltipProvider>
        </ThemeProvider>
      </QueryClientProvider>
    </HelmetProvider>
  );
}

export default App;
