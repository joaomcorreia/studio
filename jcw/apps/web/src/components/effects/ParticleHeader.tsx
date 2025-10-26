'use client';

import React from 'react';
import ParticleNetwork from './ParticleNetwork';

interface ParticleHeaderProps {
  children: React.ReactNode;
  className?: string;
  particleCount?: number;
  height?: string;
}

const ParticleHeader: React.FC<ParticleHeaderProps> = ({
  children,
  className = '',
  particleCount = 50,
  height = '100vh'
}) => {
  return (
    <div 
      className={`relative ${className}`}
      style={{ 
        height,
        background: 'linear-gradient(135deg, #0a1a5e 0%, #0d2b88 100%)',
        overflow: 'hidden'
      }}
    >
      {/* Particle Network Background */}
      <ParticleNetwork 
        particleCount={particleCount}
        connectionDistance={120}
        particleSpeed={0.4}
        colors={[
          '#3B82F6', // Blue
          '#8B5CF6', // Purple  
          '#EF4444', // Red
          '#10B981', // Green
          '#F59E0B', // Amber
          '#EC4899', // Pink
          '#06B6D4', // Cyan
          '#FFD166'  // Gold
        ]}
      />
      
      {/* Content */}
      <div className="relative z-10 h-full">
        {children}
      </div>
    </div>
  );
};

export default ParticleHeader;