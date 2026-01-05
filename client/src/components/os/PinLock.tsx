import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Lock, Delete } from 'lucide-react';

const USER_NAME = 'Levi van Iteron';
const USER_INITIALS = 'LI';
const PROFILE_PICTURE = '/profile-picture.png';

interface PinLockProps {
  onUnlock: () => void;
  correctPin: string;
}

export function PinLock({ onUnlock, correctPin }: PinLockProps) {
  const [pin, setPin] = useState('');
  const [error, setError] = useState(false);
  const [locked, setLocked] = useState(true);

  const handleDigit = (digit: string) => {
    if (pin.length < 6) {
      setPin(pin + digit);
      setError(false);
    }
  };

  const handleBackspace = () => {
    setPin(pin.slice(0, -1));
  };

  const handleSubmit = () => {
    if (pin === correctPin) {
      setLocked(false);
      setTimeout(() => onUnlock(), 600);
    } else {
      setError(true);
      setPin('');
      setTimeout(() => setError(false), 1000);
    }
  };

  useEffect(() => {
    if (pin.length === 6) {
      setTimeout(handleSubmit, 100);
    }
  }, [pin]);

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.key >= '0' && e.key <= '9') {
        handleDigit(e.key);
      } else if (e.key === 'Backspace') {
        handleBackspace();
      } else if (e.key === 'Enter') {
        if (pin.length === 6) {
          handleSubmit();
        }
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [pin]);

  if (!locked) {
    return (
      <motion.div
        initial={{ opacity: 1 }}
        animate={{ opacity: 0, scale: 0.95 }}
        transition={{ duration: 0.6 }}
        className="fixed inset-0 bg-black z-[10000] pointer-events-none"
      />
    );
  }

  return (
    <div className="h-screen w-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 flex items-center justify-center z-[10000] overflow-hidden">
      {/* Animated background grid */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0" style={{
          backgroundImage: 'linear-gradient(0deg, rgba(0, 120, 212, 0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(0, 120, 212, 0.3) 1px, transparent 1px)',
          backgroundSize: '50px 50px',
        }} />
      </div>

      {/* Animated light beams */}
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
        className="absolute inset-0 opacity-20"
      >
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-r from-blue-500 to-transparent rounded-full blur-3xl" />
      </motion.div>

      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: 'spring', damping: 15 }}
        className="relative z-10 flex flex-col items-center gap-8 bg-gradient-to-br from-purple-500/20 to-pink-500/20 backdrop-blur-sm rounded-3xl p-8 border-2 border-purple-400/50 shadow-2xl"
      >
        {/* Profile Picture */}
        <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-purple-400/50 shadow-2xl">
          <img 
            src={PROFILE_PICTURE} 
            alt={USER_NAME}
            className="w-full h-full object-cover"
            onError={(e) => {
              (e.target as HTMLImageElement).style.display = 'none';
              (e.target as HTMLImageElement).nextElementSibling?.classList.remove('hidden');
            }}
          />
          <div className="hidden w-full h-full bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center text-white text-2xl font-bold">
            {USER_INITIALS}
          </div>
        </div>

        <div className="text-center">
          <h1 className="text-2xl font-bold text-white mb-1 font-display">{USER_NAME}</h1>
          <p className="text-purple-300 text-sm">Enter your PIN to continue</p>
        </div>

        {/* PIN Display */}
        <div className="flex gap-2">
          {[0, 1, 2, 3, 4, 5].map((i) => (
            <motion.div
              key={i}
              animate={{
                scale: error ? [1, 1.1, 1] : 1,
                backgroundColor: error ? '#ef4444' : i < pin.length ? '#3b82f6' : '#27272a'
              }}
              transition={{ duration: error ? 0.3 : 0.2 }}
              className="w-12 h-12 rounded-lg border-2 border-white/10 flex items-center justify-center"
            >
              {pin.length > i && (
                <div className="w-3 h-3 bg-white rounded-full" />
              )}
            </motion.div>
          ))}
        </div>

        {/* Keypad */}
        <div className="grid grid-cols-3 gap-3">
          {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
            <button
              key={num}
              onClick={() => handleDigit(num.toString())}
              className="w-14 h-14 bg-white/10 hover:bg-white/20 border border-white/20 rounded-lg text-white font-semibold transition-all hover:scale-105 active:scale-95 text-lg"
            >
              {num}
            </button>
          ))}
        </div>

        <div className="flex gap-3 w-full justify-center">
          <button
            onClick={() => handleDigit('0')}
            className="w-14 h-14 bg-white/10 hover:bg-white/20 border border-white/20 rounded-lg text-white font-semibold transition-all hover:scale-105 active:scale-95 text-lg"
          >
            0
          </button>
          <button
            onClick={handleBackspace}
            disabled={pin.length === 0}
            className="w-14 h-14 bg-red-500/20 hover:bg-red-500/30 border border-red-500/30 rounded-lg text-red-300 transition-all hover:scale-105 active:scale-95 disabled:opacity-50 flex items-center justify-center"
          >
            <Delete className="w-5 h-5" />
          </button>
        </div>

        {error && (
          <motion.p
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="text-red-400 text-sm"
          >
            Incorrect PIN
          </motion.p>
        )}
      </motion.div>
    </div>
  );
}
