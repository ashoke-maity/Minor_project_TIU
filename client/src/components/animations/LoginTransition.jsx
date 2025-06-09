import React, { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import SignInAnimation from './SignInAnimation';

function LoginTransition({ onComplete }) {
  const containerRef = useRef(null);
  const textRef = useRef(null);
  const overlayRef = useRef(null);
  const particlesRef = useRef(null);
  const [playAnimation, setPlayAnimation] = useState(false);
  
  // Create particles for background effect
  useEffect(() => {
    if (particlesRef.current) {
      const particles = [];
      const colors = ['#10b981', '#4ade80', '#f59e0b', '#34d399'];
      
      // Determine number of particles based on screen size
      const isMobile = window.innerWidth < 768;
      const particleCount = isMobile ? 20 : 40; // Fewer particles on mobile
      
      // Create particles
      for (let i = 0; i < particleCount; i++) {
        const particle = document.createElement('div');
        particle.className = 'absolute rounded-full';
        
        // Random properties - smaller particles on mobile
        const size = isMobile 
          ? Math.random() * 20 + 5 // Smaller size range on mobile
          : Math.random() * 30 + 10;
        const color = colors[Math.floor(Math.random() * colors.length)];
        const left = Math.random() * 100;
        const delay = Math.random() * 2;
        
        // Apply styles
        particle.style.width = `${size}px`;
        particle.style.height = `${size}px`;
        particle.style.backgroundColor = color;
        particle.style.left = `${left}%`;
        particle.style.top = '110%';
        particle.style.opacity = '0';
        
        particlesRef.current.appendChild(particle);
        particles.push(particle);
        
        // Animate particles - faster on mobile
        gsap.to(particle, {
          y: -(window.innerHeight + 100),
          x: (Math.random() - 0.5) * (isMobile ? 100 : 200), // Less horizontal movement on mobile
          opacity: isMobile ? 0.2 : 0.3, // Slightly more transparent on mobile
          duration: Math.random() * (isMobile ? 8 : 10) + (isMobile ? 7 : 10),
          delay,
          repeat: -1,
          ease: 'none',
          onRepeat: () => {
            gsap.set(particle, {
              y: 100,
              x: (Math.random() - 0.5) * (isMobile ? 200 : 400),
              opacity: 0
            });
          }
        });
      }
    }
  }, []);
  
  useEffect(() => {
    // Initial animation to reveal the container
    const tl = gsap.timeline();
    
    tl.set(containerRef.current, { 
      opacity: 0
    });
    
    tl.to(containerRef.current, { 
      opacity: 1, 
      duration: 1, 
      ease: "power2.out",
      onComplete: () => setPlayAnimation(true)
    });
    
    // Text animation with glow effect
    if (textRef.current) {
      gsap.set(textRef.current.children, { 
        y: 80, 
        opacity: 0,
        filter: 'blur(15px)'
      });
      
      gsap.to(textRef.current.children, { 
        y: 0, 
        opacity: 1,
        filter: 'blur(0px)', 
        stagger: 0.15, 
        duration: 1.2, 
        delay: 0.5,
        ease: "power3.out"
      });
    }
  }, []);
  
  const handleAnimationComplete = () => {
    // Check if we're on mobile
    const isMobile = window.innerWidth < 768;
    
    // Create a more dynamic transition to the home page
    const tl = gsap.timeline({
      onComplete: () => {
        setTimeout(() => {
          if (onComplete) onComplete();
        }, isMobile ? 300 : 500); // Shorter delay on mobile
      }
    });
    
    // Create particles burst effect - fewer particles on mobile
    const burstParticles = [];
    const burstContainer = document.createElement('div');
    burstContainer.className = 'absolute inset-0 overflow-hidden z-20 pointer-events-none';
    document.body.appendChild(burstContainer);
    
    // Adjust particle count for mobile
    const particleCount = isMobile ? 30 : 50;
    
    for (let i = 0; i < particleCount; i++) {
      const particle = document.createElement('div');
      // Smaller particles on mobile
      const size = isMobile ? 
        Math.random() * 10 + 3 : // Smaller on mobile
        Math.random() * 15 + 5;  // Larger on desktop
        
      particle.className = 'absolute rounded-full';
      particle.style.width = `${size}px`;
      particle.style.height = `${size}px`;
      particle.style.backgroundColor = Math.random() > 0.5 ? '#10b981' : '#f59e0b';
      particle.style.top = '50%';
      particle.style.left = '50%';
      particle.style.transform = 'translate(-50%, -50%)';
      burstContainer.appendChild(particle);
      burstParticles.push(particle);
    }
    
    // Animate burst particles - less movement on mobile for performance
    burstParticles.forEach(particle => {
      gsap.to(particle, {
        x: (Math.random() - 0.5) * (isMobile ? window.innerWidth * 0.7 : window.innerWidth),
        y: (Math.random() - 0.5) * (isMobile ? window.innerHeight * 0.7 : window.innerHeight),
        opacity: 0,
        duration: isMobile ? 1.2 : 1.5, // Slightly faster on mobile
        ease: "power2.out"
      });
    });
    
    // Create a radial wipe effect with glowing border - adjusted for mobile
    tl.to(overlayRef.current, {
      scale: isMobile ? 20 : 25, // Slightly smaller scale on mobile
      duration: isMobile ? 1.2 : 1.5, // Faster on mobile
      ease: "power2.inOut",
      boxShadow: isMobile ? 
        '0 0 50px 8px rgba(16, 185, 129, 0.8)' : // Less intense shadow on mobile
        '0 0 80px 10px rgba(16, 185, 129, 0.8)'  // Full shadow on desktop
    });
    
    // Fade out text with blur
    tl.to(textRef.current.children, {
      opacity: 0,
      filter: 'blur(10px)',
      y: -50,
      stagger: 0.1,
      duration: 0.8
    }, "-=1.3");
    
    // Fade out the container
    tl.to(containerRef.current, {
      opacity: 0,
      duration: 0.5
    }, "-=0.5");
  };
  
  return (
    <div 
      ref={containerRef}
      className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-gray-900 overflow-hidden"
    >
      {/* Floating particles background */}
      <div 
        ref={particlesRef} 
        className="absolute inset-0 overflow-hidden opacity-40 pointer-events-none"
      />
      
      {/* 3D Animation container */}
      <div className="w-full h-3/5">
        <SignInAnimation 
          isAnimating={playAnimation} 
          onAnimationComplete={handleAnimationComplete} 
        />
      </div>
      
      {/* Text container with enhanced styling - now responsive */}
      <div ref={textRef} className="text-center z-10 relative mt-6 px-4">
        <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-3 tracking-wide">
          Welcome to AlumniConnect
        </h1>
        <p className="text-base md:text-xl bg-gradient-to-r from-emerald-400 to-green-300 bg-clip-text text-transparent font-medium">
          Reuniting classmates, building futures
        </p>
      </div>
      
      {/* Gradient overlay for transition */}
      <div 
        ref={overlayRef}
        className="absolute w-16 h-16 rounded-full bg-gradient-to-r from-emerald-400 via-green-400 to-teal-500"
        style={{ 
          bottom: '25%', 
          left: '50%', 
          transform: 'translate(-50%, 50%) scale(0)',
          boxShadow: '0 0 30px 5px rgba(16, 185, 129, 0.4)'
        }}
      />
    </div>
  );
}

export default LoginTransition;