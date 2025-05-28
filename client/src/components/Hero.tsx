import { ChevronDown, Eye, Download } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Hero() {
  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      const offsetTop = element.offsetTop - 80;
      window.scrollTo({
        top: offsetTop,
        behavior: "smooth",
      });
    }
  };

  return (
    <section id="home" className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-primary/5 to-secondary/10" />
      <div 
        className="absolute inset-0 opacity-20"
        style={{
          backgroundImage: `url('https://images.unsplash.com/photo-1517077304055-6e89abbf09b0?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&h=1080')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat'
        }}
      />

      {/* Floating Elements */}
      <div className="absolute top-1/4 left-10 w-16 h-16 bg-primary/20 rounded-full floating-animation hidden lg:block" />
      <div className="absolute bottom-1/4 right-10 w-12 h-12 bg-secondary/20 rounded-full floating-animation-delayed hidden lg:block" />
      <div className="absolute top-1/2 right-1/4 w-8 h-8 bg-primary/30 rounded-full floating-animation-delayed-2 hidden lg:block" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16">
        <div className="text-center fade-in">
          <h1 className="text-5xl md:text-7xl font-bold mb-6">
            <span className="hero-gradient">
              Full Stack Developer
            </span>
          </h1>
          
          <p className="text-xl md:text-2xl text-slate-600 mb-8 max-w-3xl mx-auto leading-relaxed">
            Creating modern, responsive web applications with cutting-edge technologies and exceptional user experiences.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16">
            <Button 
              size="lg"
              onClick={() => scrollToSection('portfolio')}
              className="bg-primary hover:bg-primary/90 text-white px-8 py-4 rounded-full font-semibold transform hover:-translate-y-1 transition-all duration-300 shadow-lg hover:shadow-xl"
            >
              <Eye className="w-4 h-4 mr-2" />
              View My Work
            </Button>
            <Button 
              variant="outline"
              size="lg"
              onClick={() => scrollToSection('contact')}
              className="border-2 border-primary text-primary hover:bg-primary hover:text-white px-8 py-4 rounded-full font-semibold transform hover:-translate-y-1 transition-all duration-300"
            >
              <Download className="w-4 h-4 mr-2" />
              Get In Touch
            </Button>
          </div>

          <div className="animate-bounce">
            <ChevronDown className="w-6 h-6 text-primary mx-auto" />
          </div>
        </div>
      </div>
    </section>
  );
}
