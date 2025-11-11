import { useEffect, useRef } from "react";

interface Particle {
  x: number;
  y: number;
  size: number;
  speedX: number;
  speedY: number;
  opacity: number;
  type: 'cart' | 'bag' | 'star';
}

export default function ParticleBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const isVisibleRef = useRef(true);
  const prefersReducedMotionRef = useRef(false);
  const animationFrameIdRef = useRef<number | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let particles: Particle[] = [];

    const resizeCanvas = () => {
      const rect = container.getBoundingClientRect();
      canvas.width = rect.width;
      canvas.height = rect.height;
    };

    const createParticles = () => {
      particles = [];
      const particleCount = Math.floor((canvas.width * canvas.height) / 15000);
      
      for (let i = 0; i < particleCount; i++) {
        particles.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          size: Math.random() * 3 + 1,
          speedX: (Math.random() - 0.5) * 0.5,
          speedY: (Math.random() - 0.5) * 0.5,
          opacity: Math.random() * 0.5 + 0.2,
          type: ['cart', 'bag', 'star'][Math.floor(Math.random() * 3)] as Particle['type'],
        });
      }
    };

    const drawShoppingCart = (x: number, y: number, size: number) => {
      ctx.beginPath();
      ctx.moveTo(x - size, y);
      ctx.lineTo(x + size, y);
      ctx.lineTo(x + size * 0.8, y + size);
      ctx.lineTo(x - size * 0.8, y + size);
      ctx.closePath();
      ctx.fill();
      
      ctx.beginPath();
      ctx.arc(x - size * 0.4, y + size * 1.3, size * 0.3, 0, Math.PI * 2);
      ctx.fill();
      ctx.beginPath();
      ctx.arc(x + size * 0.4, y + size * 1.3, size * 0.3, 0, Math.PI * 2);
      ctx.fill();
    };

    const drawShoppingBag = (x: number, y: number, size: number) => {
      ctx.beginPath();
      ctx.rect(x - size, y, size * 2, size * 1.5);
      ctx.fill();
      
      ctx.beginPath();
      ctx.arc(x, y, size * 0.6, 0, Math.PI, true);
      ctx.stroke();
    };

    const drawStar = (x: number, y: number, size: number) => {
      ctx.beginPath();
      for (let i = 0; i < 5; i++) {
        const angle = (i * 4 * Math.PI) / 5 - Math.PI / 2;
        const px = x + Math.cos(angle) * size;
        const py = y + Math.sin(angle) * size;
        if (i === 0) {
          ctx.moveTo(px, py);
        } else {
          ctx.lineTo(px, py);
        }
      }
      ctx.closePath();
      ctx.fill();
    };

    const animate = () => {
      const shouldAnimate = isVisibleRef.current && !prefersReducedMotionRef.current;
      
      if (!shouldAnimate) {
        animationFrameIdRef.current = null;
        return;
      }

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      particles.forEach((particle) => {
        particle.x += particle.speedX;
        particle.y += particle.speedY;

        if (particle.x < 0) particle.x = canvas.width;
        if (particle.x > canvas.width) particle.x = 0;
        if (particle.y < 0) particle.y = canvas.height;
        if (particle.y > canvas.height) particle.y = 0;

        ctx.fillStyle = `rgba(59, 130, 246, ${particle.opacity})`;
        ctx.strokeStyle = `rgba(59, 130, 246, ${particle.opacity})`;
        ctx.lineWidth = 1;

        if (particle.type === 'cart') {
          drawShoppingCart(particle.x, particle.y, particle.size);
        } else if (particle.type === 'bag') {
          drawShoppingBag(particle.x, particle.y, particle.size);
        } else {
          drawStar(particle.x, particle.y, particle.size);
        }
      });

      animationFrameIdRef.current = requestAnimationFrame(animate);
    };

    const startAnimation = () => {
      if (!animationFrameIdRef.current && isVisibleRef.current && !prefersReducedMotionRef.current) {
        animationFrameIdRef.current = requestAnimationFrame(animate);
      }
    };

    const stopAnimation = () => {
      if (animationFrameIdRef.current) {
        cancelAnimationFrame(animationFrameIdRef.current);
        animationFrameIdRef.current = null;
      }
    };

    const intersectionObserver = new IntersectionObserver(
      ([entry]) => {
        isVisibleRef.current = entry.isIntersecting;
        if (entry.isIntersecting) {
          startAnimation();
        } else {
          stopAnimation();
        }
      },
      { threshold: 0.1 }
    );

    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    prefersReducedMotionRef.current = mediaQuery.matches;

    const handleMotionChange = () => {
      prefersReducedMotionRef.current = mediaQuery.matches;
      if (mediaQuery.matches) {
        stopAnimation();
      } else if (isVisibleRef.current) {
        startAnimation();
      }
    };

    mediaQuery.addEventListener('change', handleMotionChange);

    if (container) {
      intersectionObserver.observe(container);
    }

    resizeCanvas();
    createParticles();
    startAnimation();

    const resizeObserver = new ResizeObserver(() => {
      resizeCanvas();
      createParticles();
    });

    if (container) {
      resizeObserver.observe(container);
    }

    return () => {
      intersectionObserver.disconnect();
      resizeObserver.disconnect();
      mediaQuery.removeEventListener('change', handleMotionChange);
      stopAnimation();
    };
  }, []);

  return (
    <div ref={containerRef} className="absolute inset-0 pointer-events-none">
      <canvas
        ref={canvasRef}
        className="w-full h-full opacity-30"
      />
    </div>
  );
}
