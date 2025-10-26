'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface LoadingEffectProps {
  isLoading: boolean;
  children: React.ReactNode;
  loadingComponent?: React.ReactNode;
  effect?: 'fade' | 'slide' | 'scale' | 'blur';
}

const LoadingEffect: React.FC<LoadingEffectProps> = ({
  isLoading,
  children,
  loadingComponent,
  effect = 'fade'
}) => {
  const effects = {
    fade: {
      initial: { opacity: 0 },
      animate: { opacity: 1 },
      exit: { opacity: 0 }
    },
    slide: {
      initial: { opacity: 0, y: 20 },
      animate: { opacity: 1, y: 0 },
      exit: { opacity: 0, y: -20 }
    },
    scale: {
      initial: { opacity: 0, scale: 0.8 },
      animate: { opacity: 1, scale: 1 },
      exit: { opacity: 0, scale: 1.2 }
    },
    blur: {
      initial: { opacity: 0, filter: 'blur(10px)' },
      animate: { opacity: 1, filter: 'blur(0px)' },
      exit: { opacity: 0, filter: 'blur(10px)' }
    }
  };

  const DefaultLoader = () => (
    <div className="flex items-center justify-center min-h-[200px]">
      <motion.div
        className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full"
        animate={{ rotate: 360 }}
        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
      />
    </div>
  );

  return (
    <AnimatePresence mode="wait">
      {isLoading ? (
        <motion.div
          key="loading"
          initial={effects[effect].initial}
          animate={effects[effect].animate}
          exit={effects[effect].exit}
          transition={{ duration: 0.3 }}
        >
          {loadingComponent || <DefaultLoader />}
        </motion.div>
      ) : (
        <motion.div
          key="content"
          initial={effects[effect].initial}
          animate={effects[effect].animate}
          exit={effects[effect].exit}
          transition={{ duration: 0.3 }}
        >
          {children}
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default LoadingEffect;