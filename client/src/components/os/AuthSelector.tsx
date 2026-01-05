import { useState } from 'react';
import { motion } from 'framer-motion';
import { Lock, KeyRound, User } from 'lucide-react';
import { PinLock } from './PinLock';
import { PasswordLock } from './PasswordLock';
import { WindowsHello } from './WindowsHello';

interface AuthSelectorProps {
  onUnlock: (isGuest?: boolean) => void;
}

export function AuthSelector({ onUnlock }: AuthSelectorProps) {
  const [selectedAuth, setSelectedAuth] = useState<'choose' | 'pin' | 'password' | 'hello' | 'guest'>('choose');

  if (selectedAuth === 'pin') {
    return (
      <PinLock 
        onUnlock={onUnlock}
        correctPin="110911"
      />
    );
  }

  if (selectedAuth === 'password') {
    return (
      <PasswordLock 
        onUnlock={onUnlock}
        correctPassword="Levi20111028!"
      />
    );
  }

  if (selectedAuth === 'hello') {
    return (
      <WindowsHello 
        onUnlock={onUnlock}
        onBack={() => setSelectedAuth('choose')}
      />
    );
  }

  if (selectedAuth === 'guest') {
    return (
      <motion.div
        initial={{ opacity: 1 }}
        animate={{ opacity: 0, scale: 0.95 }}
        transition={{ duration: 0.6 }}
        className="fixed inset-0 bg-black z-[10000] pointer-events-none"
        onAnimationComplete={() => onUnlock(true)}
      />
    );
  }

  return (
    <div className="h-screen w-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 flex flex-col items-center justify-center relative overflow-hidden">
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

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center justify-center gap-12">
        {/* Header */}
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.6 }}
          className="text-center"
        >
          <h1 className="text-4xl font-bold text-white mb-2 font-display">Windows 13</h1>
          <p className="text-cyan-300 text-sm">Choose login method</p>
        </motion.div>

        {/* Authentication Options */}
        <div className="flex flex-wrap gap-6 justify-center max-w-2xl">
          {/* Windows Hello Option */}
          <motion.button
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setSelectedAuth('hello')}
            className="flex flex-col items-center gap-4 px-8 py-8 rounded-2xl bg-gradient-to-br from-emerald-500/20 to-green-500/20 border-2 border-emerald-400/50 hover:border-emerald-300 hover:bg-gradient-to-br hover:from-emerald-500/30 hover:to-green-500/30 transition-all shadow-lg"
            data-testid="button-select-hello"
          >
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-emerald-400 to-green-400 flex items-center justify-center">
              <User className="w-8 h-8 text-white" />
            </div>
            <div className="text-center">
              <p className="text-white font-semibold">Windows Hello</p>
              <p className="text-emerald-300 text-xs mt-1">Face recognition</p>
            </div>
          </motion.button>

          {/* PIN Code Option */}
          <motion.button
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setSelectedAuth('pin')}
            className="flex flex-col items-center gap-4 px-8 py-8 rounded-2xl bg-gradient-to-br from-purple-500/20 to-pink-500/20 border-2 border-purple-400/50 hover:border-purple-300 hover:bg-gradient-to-br hover:from-purple-500/30 hover:to-pink-500/30 transition-all shadow-lg"
            data-testid="button-select-pin"
          >
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-purple-400 to-pink-400 flex items-center justify-center">
              <Lock className="w-8 h-8 text-white" />
            </div>
            <div className="text-center">
              <p className="text-white font-semibold">PIN Code</p>
              <p className="text-purple-300 text-xs mt-1">Enter 6-digit code</p>
            </div>
          </motion.button>

          {/* Password Option */}
          <motion.button
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setSelectedAuth('password')}
            className="flex flex-col items-center gap-4 px-8 py-8 rounded-2xl bg-gradient-to-br from-blue-500/20 to-cyan-500/20 border-2 border-blue-400/50 hover:border-blue-300 hover:bg-gradient-to-br hover:from-blue-500/30 hover:to-cyan-500/30 transition-all shadow-lg"
            data-testid="button-select-password"
          >
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-400 to-cyan-400 flex items-center justify-center">
              <KeyRound className="w-8 h-8 text-white" />
            </div>
            <div className="text-center">
              <p className="text-white font-semibold">Password</p>
              <p className="text-blue-300 text-xs mt-1">Enter password</p>
            </div>
          </motion.button>

          {/* Guest Option */}
          <motion.button
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.5 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setSelectedAuth('guest')}
            className="flex flex-col items-center gap-4 px-8 py-8 rounded-2xl bg-gradient-to-br from-gray-500/20 to-slate-500/20 border-2 border-gray-400/50 hover:border-gray-300 hover:bg-gradient-to-br hover:from-gray-500/30 hover:to-slate-500/30 transition-all shadow-lg"
            data-testid="button-select-guest"
          >
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-gray-400 to-slate-400 flex items-center justify-center">
              <User className="w-8 h-8 text-white" />
            </div>
            <div className="text-center">
              <p className="text-white font-semibold">Guest</p>
              <p className="text-gray-300 text-xs mt-1">Limited access</p>
            </div>
          </motion.button>
        </div>

        {/* Info text */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.6 }}
          transition={{ delay: 0.5 }}
          className="text-cyan-400/60 text-xs text-center mt-8 max-w-md"
        >
          Select your preferred authentication method to unlock your system
        </motion.p>
      </div>
    </div>
  );
}
