import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

interface ShutdownAnimationProps {
  onComplete: () => void;
}

export function ShutdownAnimation({ onComplete }: ShutdownAnimationProps) {
  const [isAnimating, setIsAnimating] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsAnimating(false);
      setTimeout(() => onComplete(), 500);
    }, 1800);
    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <motion.div
      initial={{ opacity: 1 }}
      animate={{ opacity: isAnimating ? 1 : 0 }}
      transition={{ duration: 0.8 }}
      className="fixed inset-0 z-[99999] bg-gradient-to-br from-[#0051A8] to-[#001a4d] flex items-center justify-center pointer-events-none"
    >
      <div className="flex flex-col items-center justify-center gap-8">
        {/* Windows 13 Logo - 4 Squares - Closing Animation */}
        <motion.div
          initial={{ scale: 1, opacity: 1 }}
          animate={{ scale: 0.3, opacity: 0 }}
          transition={{ delay: 0.5, duration: 1, ease: 'easeIn' }}
          className="relative w-32 h-32"
        >
          <div className="grid grid-cols-2 gap-3 w-full h-full">
            {/* Top Left */}
            <motion.div
              initial={{ scale: 1, opacity: 1 }}
              animate={{ scale: 0, opacity: 0 }}
              transition={{ delay: 0.6, duration: 0.8 }}
              className="bg-white rounded-lg shadow-2xl"
            />
            {/* Top Right */}
            <motion.div
              initial={{ scale: 1, opacity: 1 }}
              animate={{ scale: 0, opacity: 0 }}
              transition={{ delay: 0.7, duration: 0.8 }}
              className="bg-white rounded-lg shadow-2xl"
            />
            {/* Bottom Left */}
            <motion.div
              initial={{ scale: 1, opacity: 1 }}
              animate={{ scale: 0, opacity: 0 }}
              transition={{ delay: 0.8, duration: 0.8 }}
              className="bg-white rounded-lg shadow-2xl"
            />
            {/* Bottom Right */}
            <motion.div
              initial={{ scale: 1, opacity: 1 }}
              animate={{ scale: 0, opacity: 0 }}
              transition={{ delay: 0.9, duration: 0.8 }}
              className="bg-white rounded-lg shadow-2xl"
            />
          </div>
        </motion.div>

        {/* Text */}
        <motion.div
          initial={{ opacity: 1, y: 0 }}
          animate={{ opacity: 0, y: 20 }}
          transition={{ delay: 1.2, duration: 0.6 }}
          className="text-center"
        >
          <h1 className="text-4xl font-bold text-white font-display mb-2">Shutting Down</h1>
          <p className="text-white/80 text-sm">See you soon...</p>
        </motion.div>

        {/* Shutdown Progress Indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.4 }}
          className="mt-8"
        >
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: 120 }}
            transition={{ delay: 0.5, duration: 2, ease: 'linear' }}
            className="h-1 bg-white/50 rounded-full"
          />
        </motion.div>
      </div>
    </motion.div>
  );
}
