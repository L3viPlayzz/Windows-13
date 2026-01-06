import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';

interface StartupAnimationProps {
  onComplete: () => void;
}

export function StartupAnimation({ onComplete }: StartupAnimationProps) {
  const [isAnimating, setIsAnimating] = useState(true);
  const hasPlayedSound = useRef(false);

  useEffect(() => {
    if (!hasPlayedSound.current) {
      hasPlayedSound.current = true;
      try {
        const audio = new Audio('/startup-sound.mp3');
        audio.volume = 0.4;
        audio.play().catch(() => console.log('Audio playback failed'));
      } catch (err) {
        console.log('Audio not available');
      }
    }
    
    const timer = setTimeout(() => {
      setIsAnimating(false);
      setTimeout(() => onComplete(), 800);
    }, 2200);
    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <motion.div
      initial={{ opacity: 1 }}
      animate={{ opacity: isAnimating ? 1 : 0 }}
      transition={{ duration: 0.8, ease: 'easeOut' }}
      className="fixed inset-0 z-[99999] bg-blue-900 flex items-center justify-center w-screen h-screen pointer-events-none"
    >
      <div className="flex flex-col items-center justify-center gap-8 h-full w-full">
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          className="relative w-32 h-32"
        >
          <div className="grid grid-cols-2 gap-3 w-full h-full">
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.1, duration: 0.5 }}
              className="bg-white rounded-lg shadow-2xl"
            />
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              className="bg-white rounded-lg shadow-2xl"
            />
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.5 }}
              className="bg-white rounded-lg shadow-2xl"
            />
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.4, duration: 0.5 }}
              className="bg-white rounded-lg shadow-2xl"
            />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.6 }}
          className="text-center"
        >
          <h1 className="text-4xl font-bold text-white font-display mb-2">Windows 13</h1>
          <p className="text-white/80 text-sm">Future Edition</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1, duration: 0.4 }}
          className="mt-8 flex gap-2"
        >
          {[0, 1, 2, 3].map((i) => (
            <motion.div
              key={i}
              initial={{ scale: 0.5, opacity: 0.3 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{
                delay: 1.2 + i * 0.1,
                duration: 0.5,
                repeat: Infinity,
                repeatType: 'reverse',
                repeatDelay: 0.3,
              }}
              className="w-2 h-2 bg-white rounded-full"
            />
          ))}
        </motion.div>
      </div>
    </motion.div>
  );
}
