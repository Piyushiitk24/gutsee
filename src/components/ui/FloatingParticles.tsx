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
      'bg-indigo-400/20'
    ];

    const newParticles: Particle[] = [];
    for (let i = 0; i < 50; i++) {
      newParticles.push({
        id: i,
        x: Math.random() * window.innerWidth,
        y: Math.random() * window.innerHeight,
        size: Math.random() * 4 + 2,
        opacity: Math.random() * 0.6 + 0.1,
        color: colors[Math.floor(Math.random() * colors.length)],
        speed: Math.random() * 2 + 0.5,
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
            x: newX > window.innerWidth ? -particle.size : newX < -particle.size ? window.innerWidth : newX,
            y: newY > window.innerHeight ? -particle.size : newY < -particle.size ? window.innerHeight : newY,
            direction: particle.direction + (Math.random() - 0.5) * 0.1
          };
        })
      );
    }, 50);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none z-0">
      {particles.map(particle => (
        <div
          key={particle.id}
          className={`absolute rounded-full ${particle.color} backdrop-blur-sm animate-float`}
          style={{
            left: `${particle.x}px`,
            top: `${particle.y}px`,
            width: `${particle.size}px`,
            height: `${particle.size}px`,
            opacity: particle.opacity,
            animationDelay: `${particle.id * 0.1}s`,
            animationDuration: `${3 + Math.random() * 2}s`
          }}
        />
      ))}
    </div>
  );
}
