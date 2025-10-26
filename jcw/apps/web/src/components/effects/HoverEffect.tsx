'use client';

import React from 'react';
import { motion } from 'framer-motion';

interface HoverEffectProps {
  children: React.ReactNode;
  className?: string;
  effect?: 'lift' | 'glow' | 'rotate' | 'scale' | 'bounce' | 'shake';
  intensity?: 'light' | 'medium' | 'strong';
}

const HoverEffect: React.FC<HoverEffectProps> = ({
  children,
  className,
  effect = 'lift',
  intensity = 'medium'
}) => {
  const getEffectVariants = () => {
    const intensityValues = {
      light: { scale: 1.02, y: -2, rotate: 1 },
      medium: { scale: 1.05, y: -5, rotate: 3 },
      strong: { scale: 1.1, y: -10, rotate: 5 }
    };

    const current = intensityValues[intensity];

    switch (effect) {
      case 'lift':
        return {
          rest: { y: 0, scale: 1 },
          hover: { y: -current.y, scale: current.scale }
        };
      case 'glow':
        return {
          rest: { 
            boxShadow: '0 0 0 rgba(59, 130, 246, 0)',
            scale: 1 
          },
          hover: { 
            boxShadow: `0 0 ${current.y * 2}px rgba(59, 130, 246, 0.5)`,
            scale: current.scale 
          }
        };
      case 'rotate':
        return {
          rest: { rotate: 0, scale: 1 },
          hover: { rotate: current.rotate, scale: current.scale }
        };
      case 'scale':
        return {
          rest: { scale: 1 },
          hover: { scale: current.scale }
        };
      case 'bounce':
        return {
          rest: { scale: 1, y: 0 },
          hover: { 
            scale: current.scale,
            y: [0, -current.y, 0],
            transition: { type: "spring" as const, stiffness: 300 }
          }
        };
      case 'shake':
        return {
          rest: { x: 0 },
          hover: { 
            x: [-2, 2, -2, 2, 0],
            transition: { duration: 0.5 }
          }
        };
      default:
        return {
          rest: { scale: 1 },
          hover: { scale: current.scale }
        };
    }
  };

  return (
    <motion.div
      initial="rest"
      whileHover="hover"
      variants={getEffectVariants()}
      transition={{ type: "spring" as const, stiffness: 300, damping: 20 }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

export default HoverEffect;