'use client';

import { useEffect, useRef } from 'react';
import * as THREE from 'three';

export function NeuralBackground() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    // Scene setup
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    camera.position.z = 50;

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setClearColor(0x000000, 0);
    containerRef.current.appendChild(renderer.domElement);

    // Create particles (nodes)
    const particleCount = 150;
    const particles: THREE.Vector3[] = [];
    const particleGeometry = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);

    for (let i = 0; i < particleCount; i++) {
      const x = (Math.random() - 0.5) * 100;
      const y = (Math.random() - 0.5) * 100;
      const z = (Math.random() - 0.5) * 50;
      
      positions[i * 3] = x;
      positions[i * 3 + 1] = y;
      positions[i * 3 + 2] = z;
      
      particles.push(new THREE.Vector3(x, y, z));
    }

    particleGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));

    // Health-tech gradient colors (orange to red)
    const particleMaterial = new THREE.PointsMaterial({
      color: 0xff6b35,
      size: 0.8,
      transparent: true,
      opacity: 0.6,
      blending: THREE.AdditiveBlending,
    });

    const particleSystem = new THREE.Points(particleGeometry, particleMaterial);
    scene.add(particleSystem);

    // Create neural network connections (lines)
    const lineGeometry = new THREE.BufferGeometry();
    const lineMaterial = new THREE.LineBasicMaterial({
      color: 0xff6b35,
      transparent: true,
      opacity: 0.15,
      blending: THREE.AdditiveBlending,
    });

    const lines: THREE.Line[] = [];
    const maxDistance = 15;

    function updateConnections() {
      // Remove old lines
      lines.forEach(line => scene.remove(line));
      lines.length = 0;

      // Create new connections based on proximity
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const distance = particles[i].distanceTo(particles[j]);
          
          if (distance < maxDistance) {
            const lineGeo = new THREE.BufferGeometry().setFromPoints([
              particles[i],
              particles[j],
            ]);
            
            const opacity = 1 - (distance / maxDistance);
            const lineMat = new THREE.LineBasicMaterial({
              color: 0xff6b35,
              transparent: true,
              opacity: opacity * 0.15,
              blending: THREE.AdditiveBlending,
            });
            
            const line = new THREE.Line(lineGeo, lineMat);
            scene.add(line);
            lines.push(line);
          }
        }
      }
    }

    updateConnections();

    // Animation
    let frameCount = 0;
    function animate() {
      requestAnimationFrame(animate);

      // Gentle rotation
      particleSystem.rotation.y += 0.0005;
      particleSystem.rotation.x += 0.0002;

      // Particle wave motion
      const positions = particleGeometry.attributes.position.array as Float32Array;
      for (let i = 0; i < particleCount; i++) {
        const i3 = i * 3;
        positions[i3 + 1] += Math.sin(frameCount * 0.01 + i * 0.1) * 0.02;
        
        // Update particle vector for connection calculations
        particles[i].set(positions[i3], positions[i3 + 1], positions[i3 + 2]);
      }
      particleGeometry.attributes.position.needsUpdate = true;

      // Update connections every 10 frames for performance
      if (frameCount % 10 === 0) {
        updateConnections();
      }

      frameCount++;
      renderer.render(scene, camera);
    }

    animate();

    // Handle resize
    function handleResize() {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    }

    window.addEventListener('resize', handleResize);

    // Cleanup
    return () => {
      window.removeEventListener('resize', handleResize);
      containerRef.current?.removeChild(renderer.domElement);
      particleGeometry.dispose();
      particleMaterial.dispose();
      renderer.dispose();
    };
  }, []);

  return (
    <div
      ref={containerRef}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        zIndex: 0,
        pointerEvents: 'none',
      }}
    />
  );
}
