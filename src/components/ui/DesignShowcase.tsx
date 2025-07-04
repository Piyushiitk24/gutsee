'use client';

import { useState, useEffect } from 'react';
import { SparklesIcon, EyeIcon, PaletteIcon, LayersIcon } from 'lucide-react';

export function DesignShowcase() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 1000);
    return () => clearTimeout(timer);
  }, []);

  const features = [
    {
      icon: SparklesIcon,
      title: "Dynamic Gradients",
      description: "Multi-layer animated gradients that create depth and movement",
      gradient: "from-purple-500 to-pink-500"
    },
    {
      icon: EyeIcon,
      title: "Glass Morphism",
      description: "Translucent 3D-like elements with backdrop blur effects",
      gradient: "from-cyan-500 to-blue-500"
    },
    {
      icon: PaletteIcon,
      title: "Floating Animations",
      description: "Smooth parallax scrolling and floating particle effects",
      gradient: "from-teal-500 to-emerald-500"
    },
    {
      icon: LayersIcon,
      title: "Immersive Depth",
      description: "Multi-layer backgrounds with 3D visual hierarchy",
      gradient: "from-indigo-500 to-purple-500"
    }
  ];

  if (!isVisible) return null;

  return (
    <div className="fixed top-4 right-4 z-50 max-w-sm">
      <div className="backdrop-blur-xl bg-white/10 rounded-3xl p-6 border border-white/20 shadow-2xl animate-float-slow">
        <div className="flex items-center mb-4">
          <div className="w-3 h-3 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full mr-3 animate-pulse"></div>
          <h3 className="text-lg font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
            Floating Glass Oasis
          </h3>
        </div>
        
        <div className="space-y-3">
          {features.map((feature, index) => (
            <div key={index} className="flex items-start space-x-3 p-3 rounded-2xl backdrop-blur-sm bg-white/5 hover:bg-white/10 transition-all duration-300">
              <div className={`p-2 bg-gradient-to-r ${feature.gradient} rounded-lg`}>
                <feature.icon className="w-4 h-4 text-white" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-semibold text-white mb-1">{feature.title}</p>
                <p className="text-xs text-white/70">{feature.description}</p>
              </div>
            </div>
          ))}
        </div>
        
        <div className="mt-4 pt-4 border-t border-white/20">
          <p className="text-xs text-white/60 text-center">
            ✨ Experience the immersive, modern vibe ✨
          </p>
        </div>
      </div>
    </div>
  );
}
