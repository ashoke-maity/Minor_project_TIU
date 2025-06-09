import React, { useRef, useEffect, useState, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera, useGLTF } from '@react-three/drei';
import * as THREE from 'three';
import gsap from 'gsap';

// 3D Model Component
function Model3D({ isAnimating, onAnimationComplete }) {
  const modelRef = useRef();
  const { scene } = useGLTF('/models/base_basic_pbr.glb');
  const [isComplete, setIsComplete] = useState(false);
  const isMobile = window.innerWidth < 768;
  
  // Scale model based on device
  const modelScale = isMobile ? 2.0 : 2.5;
  
  useEffect(() => {
    if (isAnimating && !isComplete) {
      const timeline = gsap.timeline({
        onComplete: () => {
          setIsComplete(true);
          if (onAnimationComplete) onAnimationComplete();
        }
      });
      
      // Initial state
      gsap.set(modelRef.current.position, { y: -5 });
      gsap.set(modelRef.current.rotation, { y: 0 });
      gsap.set(modelRef.current.scale, { x: 0, y: 0, z: 0 });
      
      // Animation sequence - optimize durations for mobile
      timeline
        .to(modelRef.current.position, {
          y: 0,
          duration: isMobile ? 1.2 : 1.5, // Slightly faster on mobile
          ease: "elastic.out(1, 0.5)"
        })
        .to(modelRef.current.scale, {
          x: modelScale, 
          y: modelScale, 
          z: modelScale,
          duration: isMobile ? 0.8 : 1.0,
          ease: "back.out(1.7)"
        }, "-=1")
        .to(modelRef.current.rotation, {
          y: Math.PI * 2,
          duration: isMobile ? 1.5 : 2.0,
          ease: "power1.inOut"
        });
        
      // Add floating animation once the initial animation is complete  
      timeline.add(() => {
        // Continuous floating up and down - subtler on mobile
        gsap.to(modelRef.current.position, {
          y: `+=${isMobile ? 0.3 : 0.5}`,
          duration: isMobile ? 1.5 : 2.0,
          repeat: -1,
          yoyo: true,
          ease: "sine.inOut"
        });
        
        // Slight tilting animation - subtler on mobile
        gsap.to(modelRef.current.rotation, {
          x: isMobile ? 0.05 : 0.1,
          z: isMobile ? 0.05 : 0.1,
          duration: isMobile ? 2.5 : 3.5,
          repeat: -1,
          yoyo: true,
          ease: "sine.inOut"
        });
      });
    }
  }, [isAnimating, isComplete, onAnimationComplete, isMobile, modelScale]);
  
  // Continuous dynamic rotation with varying speed - optimized for mobile
  useFrame((state) => {
    if (modelRef.current) {
      // Base rotation speed - slower on mobile for better performance
      const baseSpeed = isMobile ? 0.005 : 0.008;
      
      // Add some variation to rotation speed based on time
      const time = state.clock.getElapsedTime();
      const speedVariation = Math.sin(time * 0.2) * (isMobile ? 0.002 : 0.003);
      
      // Apply the rotation
      modelRef.current.rotation.y += baseSpeed + speedVariation;
    }
  });
  
  return (
    <primitive 
      ref={modelRef}
      object={scene.clone()} 
      position={[0, 0, 0]} 
      scale={[modelScale, modelScale, modelScale]}
    />
  );
}

// Enhanced particles
function Particles({ count = 200 }) {
  const particlesRef = useRef();
  
  // Use useMemo to create the particle positions and colors
  const [positions, colors] = useMemo(() => {
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);
    
    const color1 = new THREE.Color("#10b981");
    const color2 = new THREE.Color("#f59e0b");
    
    for (let i = 0; i < count; i++) {
      const i3 = i * 3;
      positions[i3] = (Math.random() - 0.5) * 15;
      positions[i3 + 1] = (Math.random() - 0.5) * 15;
      positions[i3 + 2] = (Math.random() - 0.5) * 15;
      
      // Mix colors based on position
      const mixRatio = Math.random();
      const mixedColor = color1.clone().lerp(color2, mixRatio);
      colors[i3] = mixedColor.r;
      colors[i3 + 1] = mixedColor.g;
      colors[i3 + 2] = mixedColor.b;
    }
    
    return [positions, colors];
  }, [count]);
  
  useEffect(() => {
    gsap.to(particlesRef.current.rotation, {
      y: Math.PI * 2,
      duration: 25,
      repeat: -1,
      ease: "none"
    });
  }, []);
  
  useFrame((state) => {
    const time = state.clock.getElapsedTime() * 0.1;
    particlesRef.current.rotation.x = Math.sin(time) * 0.2;
  });
  
  return (
    <points ref={particlesRef}>
      <bufferGeometry>
        <bufferAttribute 
          attach="attributes-position" 
          count={count} 
          array={positions} 
          itemSize={3} 
        />
        <bufferAttribute 
          attach="attributes-color" 
          count={count} 
          array={colors} 
          itemSize={3} 
        />
      </bufferGeometry>
      <pointsMaterial 
        size={0.1} 
        vertexColors 
        transparent 
        opacity={0.7}
        sizeAttenuation 
      />
    </points>
  );
}

// Main component
function SignInAnimation({ isAnimating = false, onAnimationComplete }) {
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  
  // Preload the model
  useGLTF.preload('/models/base_basic_pbr.glb');
  
  // Responsive handling
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  
  return (
    <div className="w-full h-full">
      <Canvas
        dpr={[1, isMobile ? 1.5 : 2]} // Lower DPR for mobile devices
        performance={{ min: 0.5 }} // Allow performance scaling for mobile
      >
        <PerspectiveCamera 
          makeDefault 
          position={[0, 0, isMobile ? 8 : 6]} // Move camera back on mobile for better view
          fov={isMobile ? 60 : 50} // Wider field of view on mobile
        />
        <ambientLight intensity={0.3} />
        <spotLight position={[10, 10, 10]} angle={0.3} penumbra={1} intensity={1} />
        <pointLight position={[-10, -10, -10]} color="#10b981" intensity={1.5} />
        <pointLight position={[10, -5, 5]} color="#f59e0b" intensity={1} />
        
        <Model3D isAnimating={isAnimating} onAnimationComplete={onAnimationComplete} />
        {/* Conditional rendering based on device capability */}
        {!isMobile && <Particles />}
        {isMobile && <Particles count={100} />} {/* Fewer particles on mobile */}
        
        <OrbitControls 
          enableZoom={false} 
          enablePan={false}
          enableRotate={isAnimating ? false : true}
          // Add touch behavior optimization
          enableDamping={true}
          dampingFactor={0.15}
          rotateSpeed={isMobile ? 0.7 : 1} // Slower rotation on mobile for better control
        />
      </Canvas>
    </div>
  );
}

export default SignInAnimation;