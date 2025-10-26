'use client';

import React from 'react';
import { motion } from 'framer-motion';

interface ParallaxEffectProps {
  children: React.ReactNode;
  className?: string;
  speed?: number; // -1 to 1, negative for reverse
  direction?: 'vertical' | 'horizontal';
}

const ParallaxEffect: React.FC<ParallaxEffectProps> = ({
  children,
  className,
  speed = 0.5,
  direction = 'vertical'
}) => {
  const [scrollY, setScrollY] = React.useState(0);

  React.useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const transform = direction === 'vertical' 
    ? `translateY(${scrollY * speed}px)` 
    : `translateX(${scrollY * speed}px)`;

  return (
    <motion.div
      style={{ transform }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

export default ParallaxEffect;