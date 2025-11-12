import { useEffect, useRef } from "react";
import * as THREE from "three";

export default function ThreeJsCart() {
  const containerRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const cartGroupRef = useRef<THREE.Group | null>(null);
  const glowLightRef = useRef<THREE.PointLight | null>(null);
  const animationFrameRef = useRef<number | null>(null);
  const isHoveredRef = useRef(false);
  const scrollYRef = useRef(0);
  const raycasterRef = useRef<THREE.Raycaster>(new THREE.Raycaster());
  const mouseRef = useRef<THREE.Vector2>(new THREE.Vector2());

  useEffect(() => {
    if (!containerRef.current) return;

    // Check for WebGL support
    const canvas = document.createElement('canvas');
    const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
    if (!gl) {
      console.warn('ThreeJsCart: WebGL not supported, skipping 3D cart animation');
      return;
    }

    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    } catch (error) {
      console.warn('ThreeJsCart: Failed to create WebGL renderer', error);
      return;
    }

    const scene = new THREE.Scene();
    sceneRef.current = scene;

    const camera = new THREE.PerspectiveCamera(
      75,
      containerRef.current.clientWidth / containerRef.current.clientHeight,
      0.1,
      1000
    );
    camera.position.z = 5;
    cameraRef.current = camera;

    renderer.setSize(containerRef.current.clientWidth, containerRef.current.clientHeight);
    renderer.setClearColor(0x000000, 0);
    containerRef.current.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // Create shopping cart using basic geometry
    const cartGroup = new THREE.Group();
    cartGroupRef.current = cartGroup;

    // Cart body (basket)
    const basketGeometry = new THREE.BoxGeometry(1.5, 1, 1);
    const basketMaterial = new THREE.MeshStandardMaterial({
      color: 0x3b82f6,
      metalness: 0.6,
      roughness: 0.4,
    });
    const basket = new THREE.Mesh(basketGeometry, basketMaterial);
    basket.position.y = 0.5;
    cartGroup.add(basket);

    // Cart handle
    const handleGeometry = new THREE.TorusGeometry(0.3, 0.08, 16, 100, Math.PI);
    const handleMaterial = new THREE.MeshStandardMaterial({
      color: 0x2563eb,
      metalness: 0.7,
      roughness: 0.3,
    });
    const handle = new THREE.Mesh(handleGeometry, handleMaterial);
    handle.position.set(0, 1.2, 0.5);
    handle.rotation.x = Math.PI / 2;
    cartGroup.add(handle);

    // Cart wheels
    const wheelGeometry = new THREE.CylinderGeometry(0.2, 0.2, 0.1, 32);
    const wheelMaterial = new THREE.MeshStandardMaterial({
      color: 0x1e293b,
      metalness: 0.8,
      roughness: 0.2,
    });

    const wheelPositions = [
      [-0.5, -0.2, 0.5],
      [0.5, -0.2, 0.5],
      [-0.5, -0.2, -0.5],
      [0.5, -0.2, -0.5],
    ];

    wheelPositions.forEach((pos) => {
      const wheel = new THREE.Mesh(wheelGeometry, wheelMaterial);
      wheel.position.set(pos[0], pos[1], pos[2]);
      wheel.rotation.z = Math.PI / 2;
      cartGroup.add(wheel);
    });

    // Add glow light
    const glowLight = new THREE.PointLight(0x60a5fa, 0, 5);
    glowLight.position.set(0, 0.5, 1);
    glowLightRef.current = glowLight;
    cartGroup.add(glowLight);

    // Ambient light
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    scene.add(ambientLight);

    // Directional light
    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(5, 5, 5);
    scene.add(directionalLight);

    // Spotlight for dramatic effect
    const spotLight = new THREE.SpotLight(0x60a5fa, 0.5);
    spotLight.position.set(0, 5, 5);
    spotLight.angle = Math.PI / 6;
    scene.add(spotLight);

    scene.add(cartGroup);

    // Initial position (off-screen right)
    cartGroup.position.x = 10;
    cartGroup.rotation.y = -Math.PI / 4;

    // Roll-in animation on load
    let rollInProgress = 0;
    const rollInDuration = 2000; // 2 seconds
    const startTime = Date.now();

    // Handle scroll
    const handleScroll = () => {
      scrollYRef.current = window.scrollY;
    };
    window.addEventListener("scroll", handleScroll);

    // Handle mouse move for raycasting (using window to work with pointer-events: none)
    const handleMouseMove = (event: MouseEvent) => {
      if (!containerRef.current) return;
      
      const rect = containerRef.current.getBoundingClientRect();
      
      // Check if mouse is within the container bounds
      const isInBounds = 
        event.clientX >= rect.left &&
        event.clientX <= rect.right &&
        event.clientY >= rect.top &&
        event.clientY <= rect.bottom;
      
      if (!isInBounds) {
        isHoveredRef.current = false;
        return;
      }
      
      mouseRef.current.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      mouseRef.current.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
      
      // Raycast to detect hover
      raycasterRef.current.setFromCamera(mouseRef.current, camera);
      const intersects = raycasterRef.current.intersectObjects(cartGroup.children, true);
      
      isHoveredRef.current = intersects.length > 0;
    };
    window.addEventListener("mousemove", handleMouseMove);

    // Animation loop
    const animate = () => {
      const elapsed = Date.now() - startTime;
      
      // Roll-in animation
      if (rollInProgress < 1) {
        rollInProgress = Math.min(elapsed / rollInDuration, 1);
        const easeOut = 1 - Math.pow(1 - rollInProgress, 3);
        
        cartGroup.position.x = 10 - (10 + 1) * easeOut;
        
        // Rotate wheels while rolling
        cartGroup.children.slice(2, 6).forEach((wheel) => {
          if (wheel instanceof THREE.Mesh) {
            wheel.rotation.x = -easeOut * Math.PI * 4;
          }
        });
      }

      // Hover effect - wiggle and glow
      if (isHoveredRef.current && rollInProgress >= 1) {
        const wiggle = Math.sin(Date.now() * 0.005) * 0.1;
        cartGroup.rotation.z = wiggle * 0.2;
        cartGroup.position.y = Math.sin(Date.now() * 0.003) * 0.1;
        
        if (glowLightRef.current) {
          glowLightRef.current.intensity = 2 + Math.sin(Date.now() * 0.01) * 1;
        }
      } else {
        cartGroup.rotation.z = 0;
        cartGroup.position.y = 0;
        
        if (glowLightRef.current) {
          glowLightRef.current.intensity = 0;
        }
      }

      // Scroll-based motion (parallax path)
      if (rollInProgress >= 1) {
        const scrollProgress = Math.min(scrollYRef.current / 500, 1);
        const pathX = -1 + Math.sin(scrollProgress * Math.PI) * 2;
        const pathY = -scrollProgress * 2;
        
        if (!isHoveredRef.current) {
          cartGroup.position.x = pathX;
          cartGroup.position.y = pathY;
        }
      }

      // Gentle rotation
      if (rollInProgress >= 1 && !isHoveredRef.current) {
        cartGroup.rotation.y = -Math.PI / 4 + Math.sin(Date.now() * 0.0005) * 0.2;
      }

      renderer.render(scene, camera);
      animationFrameRef.current = requestAnimationFrame(animate);
    };

    animate();

    // Handle resize
    const handleResize = () => {
      if (!containerRef.current) return;
      
      camera.aspect = containerRef.current.clientWidth / containerRef.current.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(containerRef.current.clientWidth, containerRef.current.clientHeight);
    };
    window.addEventListener("resize", handleResize);

    // Cleanup
    return () => {
      const currentContainer = containerRef.current;
      
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("mousemove", handleMouseMove);
      
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      
      if (currentContainer && renderer.domElement) {
        currentContainer.removeChild(renderer.domElement);
      }
      
      renderer.dispose();
      basketGeometry.dispose();
      basketMaterial.dispose();
      handleGeometry.dispose();
      handleMaterial.dispose();
      wheelGeometry.dispose();
      wheelMaterial.dispose();
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="absolute inset-0 pointer-events-none"
      style={{ zIndex: 15 }}
    />
  );
}
