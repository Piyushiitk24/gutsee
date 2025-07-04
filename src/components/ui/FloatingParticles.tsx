'use client';

import { useEffect, useState } from 'react';

interface Particle {
  id: number;
  x: number;
  y: number;
  size: number;
  opacity: number;
  color: string;
  speed: number;
  direction: number;
}

export function FloatingParticles() {
  const [particles, setParticles] = useState<Particle[]>([]);

  useEffect(() => {
    const colors = [
      'bg-purple-400/20',
      'bg-pink-400/20',
      'bg-cyan-400/20',
      'bg-blue-400/20',
      'bg-teal-400/20',
      'bg-indigo-400/20',
      'bg-violet-400/15',
      'bg-emerald-400/15',
      'bg-rose-400/15',
      'bg-sky-400/15'
    ];

    const newParticles: Particle[] = [];
    for (let i = 0; i < 75; i++) {
      newParticles.push({
        id: i,
        x: Math.random() * (typeof window !== 'undefined' ? window.innerWidth : 1200),
        y: Math.random() * (typeof window !== 'undefined' ? window.innerHeight : 800),
        size: Math.random() * 6 + 2,
        opacity: Math.random() * 0.8 + 0.2,
        color: colors[Math.floor(Math.random() * colors.length)],
        speed: Math.random() * 3 + 0.5,
        direction: Math.random() * 360
      });
    }
    setParticles(newParticles);

    const interval = setInterval(() => {
      setParticles(prev => 
        prev.map(particle => {
          const newX = particle.x + Math.cos(particle.direction) * particle.speed;
          const newY = particle.y + Math.sin(particle.direction) * particle.speed;
          
          return {
            ...particle,
            x: newX > (typeof window !== 'undefined' ? window.innerWidth : 1200) ? -particle.size : newX < -particle.size ? (typeof window !== 'undefined' ? window.innerWidth : 1200) : newX,
            y: newY > (typeof window !== 'undefined' ? window.innerHeight : 800) ? -particle.size : newY < -particle.size ? (typeof window !== 'undefined' ? window.innerHeight : 800) : newY,
            direction: particle.direction + (Math.random() - 0.5) * 0.2
          };
        })
      );
    }, 50);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none z-0">
      {particles.map((particle, index) => (
        <div
          key={particle.id}
          className={`absolute rounded-full ${particle.color} backdrop-blur-sm animate-bubble-float shadow-lg`}
          style={{
            left: `${particle.x}px`,
            top: `${particle.y}px`,
            width: `${particle.size}px`,
            height: `${particle.size}px`,
            opacity: particle.opacity,
            animationDelay: `${index * 0.1}s`,
            animationDuration: `${4 + Math.random() * 3}s`,
            boxShadow: particle.size > 4 ? `0 0 ${particle.size * 2}px ${particle.color.replace('bg-', '').replace('/20', '').replace('/15', '')}` : 'none'
          }}
        />
      ))}
      
      {/* Additional larger ambient particles */}
      <div className="absolute top-1/3 left-1/5 w-3 h-3 bg-purple-300/30 rounded-full animate-float-slow blur-sm"></div>
      <div className="absolute top-2/3 right-1/4 w-2 h-2 bg-cyan-300/30 rounded-full animate-float-medium blur-sm animation-delay-2000"></div>
      <div className="absolute top-1/2 left-3/4 w-4 h-4 bg-pink-300/25 rounded-full animate-float blur-sm animation-delay-3000"></div>
      <div className="absolute top-1/4 right-1/3 w-2 h-2 bg-teal-300/30 rounded-full animate-float-slow blur-sm animation-delay-4000"></div>
      <div className="absolute bottom-1/3 left-1/2 w-3 h-3 bg-indigo-300/25 rounded-full animate-float-medium blur-sm animation-delay-5000"></div>
    </div>
  );
}
