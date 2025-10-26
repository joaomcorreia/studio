'use client';

import React from 'react';
import { motion } from 'framer-motion';

interface ClickEffectProps {
  children: React.ReactNode;
  className?: string;
  effect?: 'ripple' | 'pulse' | 'bounce' | 'shake' | 'glow';
  color?: string;
}

const ClickEffect: React.FC<ClickEffectProps> = ({
  children,
  className,
  effect = 'ripple',
  color = 'rgba(59, 130, 246, 0.5)'
}) => {
  const [isClicked, setIsClicked] = React.useState(false);

  const handleClick = () => {
    setIsClicked(true);
    setTimeout(() => setIsClicked(false), 300);
  };

  const getEffectVariants = () => {
    switch (effect) {
      case 'ripple':
        return {
          rest: { scale: 1 },
          tap: { scale: 0.95 }
        };
      case 'pulse':
        return {
          rest: { scale: 1 },
          tap: { scale: [1, 1.1, 1] }
        };
      case 'bounce':
        return {
          rest: { y: 0 },
          tap: { y: [0, -10, 0] }
        };
      case 'shake':
        return {
          rest: { x: 0 },
          tap: { x: [-5, 5, -5, 5, 0] }
        };
      case 'glow':
        return {
          rest: { boxShadow: '0 0 0 rgba(59, 130, 246, 0)' },
          tap: { boxShadow: `0 0 20px ${color}` }
        };
      default:
        return {
          rest: { scale: 1 },
          tap: { scale: 0.95 }
        };
    }
  };

  return (
    <motion.div
      className={`relative overflow-hidden ${className}`}
      initial="rest"
      whileTap="tap"
      variants={getEffectVariants()}
      onClick={handleClick}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
    >
      {children}
      {effect === 'ripple' && isClicked && (
        <motion.div
          className="absolute inset-0 pointer-events-none"
          initial={{ scale: 0, opacity: 0.8 }}
          animate={{ scale: 2, opacity: 0 }}
          transition={{ duration: 0.3 }}
        >
          <div 
            className="w-full h-full rounded-full"
            style={{ backgroundColor: color }}
          />
        </motion.div>
      )}
    </motion.div>
  );
};

export default ClickEffect;