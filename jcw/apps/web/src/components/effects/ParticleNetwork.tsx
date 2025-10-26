'use client';

import React, { useRef, useEffect } from 'react';

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  color: string;
  connections: number;
}

interface ParticleNetworkProps {
  className?: string;
  particleCount?: number;
  connectionDistance?: number;
  particleSpeed?: number;
  colors?: string[];
}

const ParticleNetwork: React.FC<ParticleNetworkProps> = ({
  className = '',
  particleCount = 80,
  connectionDistance = 120,
  particleSpeed = 0.5,
  colors = [
    '#3B82F6', // Blue
    '#8B5CF6', // Purple  
    '#EF4444', // Red
    '#10B981', // Green
    '#F59E0B', // Amber
    '#EC4899', // Pink
    '#06B6D4'  // Cyan
  ]
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>();
  const particlesRef = useRef<Particle[]>([]);
  const mouseRef = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size
    const resizeCanvas = () => {
      canvas.width = canvas.offsetWidth * window.devicePixelRatio;
      canvas.height = canvas.offsetHeight * window.devicePixelRatio;
      ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
      
      // Reinitialize particles when canvas resizes
      initParticles();
    };

    // Initialize particles
    const initParticles = () => {
      particlesRef.current = [];
      const width = canvas.offsetWidth;
      const height = canvas.offsetHeight;

      for (let i = 0; i < particleCount; i++) {
        particlesRef.current.push({
          x: Math.random() * width,
          y: Math.random() * height,
          vx: (Math.random() - 0.5) * particleSpeed,
          vy: (Math.random() - 0.5) * particleSpeed,
          radius: Math.random() * 3 + 1,
          color: colors[Math.floor(Math.random() * colors.length)],
          connections: 0
        });
      }
    };

    // Mouse move handler
    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouseRef.current.x = e.clientX - rect.left;
      mouseRef.current.y = e.clientY - rect.top;
    };

    // Animation loop
    const animate = () => {
      const width = canvas.offsetWidth;
      const height = canvas.offsetHeight;

      // Clear canvas with subtle gradient background
      const gradient = ctx.createLinearGradient(0, 0, width, height);
      gradient.addColorStop(0, 'rgba(10, 26, 94, 0.95)'); // Dark blue
      gradient.addColorStop(1, 'rgba(13, 43, 136, 0.95)'); // Slightly lighter blue
      
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, width, height);

      // Reset connection counts
      particlesRef.current.forEach(particle => {
        particle.connections = 0;
      });

      // Update and draw particles
      particlesRef.current.forEach((particle, i) => {
        // Update position
        particle.x += particle.vx;
        particle.y += particle.vy;

        // Bounce off edges
        if (particle.x < 0 || particle.x > width) particle.vx *= -1;
        if (particle.y < 0 || particle.y > height) particle.vy *= -1;

        // Keep particles in bounds
        particle.x = Math.max(0, Math.min(width, particle.x));
        particle.y = Math.max(0, Math.min(height, particle.y));

        // Mouse interaction - attract particles to mouse
        const mouseDistance = Math.sqrt(
          Math.pow(mouseRef.current.x - particle.x, 2) + 
          Math.pow(mouseRef.current.y - particle.y, 2)
        );
        
        if (mouseDistance < 100) {
          const attraction = 0.02;
          particle.vx += (mouseRef.current.x - particle.x) * attraction;
          particle.vy += (mouseRef.current.y - particle.y) * attraction;
        }

        // Draw connections to other particles
        particlesRef.current.slice(i + 1).forEach(otherParticle => {
          const distance = Math.sqrt(
            Math.pow(particle.x - otherParticle.x, 2) + 
            Math.pow(particle.y - otherParticle.y, 2)
          );

          if (distance < connectionDistance && particle.connections < 3 && otherParticle.connections < 3) {
            // Calculate line opacity based on distance
            const opacity = 1 - (distance / connectionDistance);
            
            // Create gradient for the connection line
            const lineGradient = ctx.createLinearGradient(
              particle.x, particle.y, 
              otherParticle.x, otherParticle.y
            );
            lineGradient.addColorStop(0, particle.color + Math.floor(opacity * 255).toString(16).padStart(2, '0'));
            lineGradient.addColorStop(1, otherParticle.color + Math.floor(opacity * 255).toString(16).padStart(2, '0'));

            ctx.strokeStyle = lineGradient;
            ctx.lineWidth = opacity * 2;
            ctx.beginPath();
            ctx.moveTo(particle.x, particle.y);
            ctx.lineTo(otherParticle.x, otherParticle.y);
            ctx.stroke();

            particle.connections++;
            otherParticle.connections++;
          }
        });

        // Draw particle with glow effect
        const glowSize = particle.radius * 3;
        
        // Outer glow
        const glowGradient = ctx.createRadialGradient(
          particle.x, particle.y, 0,
          particle.x, particle.y, glowSize
        );
        glowGradient.addColorStop(0, particle.color + '80'); // 50% opacity
        glowGradient.addColorStop(1, particle.color + '00'); // 0% opacity
        
        ctx.fillStyle = glowGradient;
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, glowSize, 0, Math.PI * 2);
        ctx.fill();

        // Inner particle
        ctx.fillStyle = particle.color;
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2);
        ctx.fill();

        // Particle highlight
        ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
        ctx.beginPath();
        ctx.arc(particle.x - particle.radius * 0.3, particle.y - particle.radius * 0.3, particle.radius * 0.4, 0, Math.PI * 2);
        ctx.fill();
      });

      animationRef.current = requestAnimationFrame(animate);
    };

    // Initialize
    resizeCanvas();
    canvas.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('resize', resizeCanvas);
    animate();

    // Cleanup
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
      canvas.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', resizeCanvas);
    };
  }, [particleCount, connectionDistance, particleSpeed, colors]);

  return (
    <canvas
      ref={canvasRef}
      className={`absolute inset-0 ${className}`}
      style={{ 
        width: '100%', 
        height: '100%',
        pointerEvents: 'none' // Allow clicks to pass through to elements below
      }}
    />
  );
};

export default ParticleNetwork;