import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { Button } from '@/components/ui/button';

const LandingPage = ({ onEnterApp }) => {
  const containerRef = useRef();
  const mousePosition = useRef({ x: 0, y: 0 });

  useEffect(() => {
    // Setup Three.js scene
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    
    renderer.setSize(window.innerWidth, window.innerHeight);
    containerRef.current.appendChild(renderer.domElement);

    // Create floating number particles
    const particles = new THREE.Group();
    const digits = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];
    
    for (let i = 0; i < 100; i++) {
      const digit = digits[Math.floor(Math.random() * digits.length)];
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      
      canvas.width = 64;
      canvas.height = 64;
      
      ctx.fillStyle = '#ffffff';
      ctx.font = '32px monospace';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(digit, 32, 32);

      const texture = new THREE.CanvasTexture(canvas);
      const material = new THREE.SpriteMaterial({ map: texture, transparent: true });
      const sprite = new THREE.Sprite(material);

      sprite.position.set(
        Math.random() * 20 - 10,
        Math.random() * 20 - 10,
        Math.random() * 20 - 10
      );
      
      sprite.scale.set(0.5, 0.5, 0.5);
      particles.add(sprite);
    }

    scene.add(particles);
    camera.position.z = 15;

    // Handle mouse movement
    const onMouseMove = (event) => {
      mousePosition.current = {
        x: (event.clientX / window.innerWidth) * 2 - 1,
        y: -(event.clientY / window.innerHeight) * 2 + 1
      };
    };

    window.addEventListener('mousemove', onMouseMove);

    // Animation loop
    const animate = () => {
      requestAnimationFrame(animate);

      particles.rotation.x += 0.001;
      particles.rotation.y += 0.002;

      // Respond to mouse position
      particles.rotation.x += mousePosition.current.y * 0.001;
      particles.rotation.y += mousePosition.current.x * 0.001;

      renderer.render(scene, camera);
    };

    animate();

    // Handle window resize
    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };

    window.addEventListener('resize', handleResize);

    // Cleanup
    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('resize', handleResize);
      containerRef.current?.removeChild(renderer.domElement);
    };
  }, []);

  return (
    <div className="relative h-screen">
      <div ref={containerRef} className="absolute inset-0" />
      
      {/* Header */}
      <div className="absolute top-0 left-0 right-0 z-20 p-6">
        <h1 className="text-4xl md:text-5xl font-black tracking-tighter text-white text-center uppercase">
          <span className="inline-block transform hover:scale-105 transition-transform duration-200 bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
            Luhnify
          </span>
        </h1>
      </div>

      {/* Main content */}
      <div className="relative z-10 h-full flex flex-col items-center justify-center">
        <h2 className="text-7xl md:text-8xl font-black mb-8 text-white tracking-tight bg-gradient-to-b from-white to-gray-400 bg-clip-text text-transparent">
          Luhnify
        </h2>
        <Button
          onClick={onEnterApp}
          size="lg"
          className="text-xl px-8 py-6 bg-white text-black hover:bg-gray-200 font-bold tracking-wide transform hover:scale-105 transition-all duration-200"
        >
          Count Em Up
        </Button>
      </div>
    </div>
  );
};

export default LandingPage;
