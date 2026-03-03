'use client';

import { motion } from 'framer-motion';
import { Loader2 } from 'lucide-react';

interface LoadingSpinnerProps {
  message?: string;
  subMessage?: string;
  size?: 'sm' | 'md' | 'lg';
}

export default function LoadingSpinner({
  message = 'Generating system design...',
  subMessage = 'This may take 10-30 seconds',
  size = 'lg',
}: LoadingSpinnerProps) {
  const sizeClasses = {
    sm: 'w-5 h-5',
    md: 'w-8 h-8',
    lg: 'w-12 h-12',
  };

  return (
    <div className="flex flex-col items-center justify-center gap-6 py-12">
      <div className="relative">
        {/* Outer glow ring */}
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.6, 0.3],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
          className={`absolute inset-0 rounded-full bg-accent/20 blur-xl ${
            size === 'lg' ? 'w-20 h-20 -inset-4' : ''
          }`}
        />

        {/* Spinning icon */}
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1.5, repeat: Infinity, ease: 'linear' }}
        >
          <Loader2 className={`${sizeClasses[size]} text-accent`} />
        </motion.div>
      </div>

      {message && (
        <div className="text-center space-y-2">
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-white font-medium text-lg"
          >
            {message}
          </motion.p>
          {subMessage && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="text-dark-400 text-sm"
            >
              {subMessage}
            </motion.p>
          )}
        </div>
      )}

      {/* Progress dots */}
      <div className="flex gap-1.5">
        {[0, 1, 2].map((i) => (
          <motion.div
            key={i}
            animate={{
              scale: [1, 1.4, 1],
              opacity: [0.3, 1, 0.3],
            }}
            transition={{
              duration: 1,
              repeat: Infinity,
              delay: i * 0.2,
              ease: 'easeInOut',
            }}
            className="w-2 h-2 rounded-full bg-accent"
          />
        ))}
      </div>
    </div>
  );
}

// Skeleton card for loading states
export function SkeletonCard() {
  return (
    <div className="rounded-2xl border border-dark-700/50 bg-dark-800/50 p-6 space-y-4">
      <div className="h-5 w-3/4 shimmer rounded-lg" />
      <div className="h-4 w-full shimmer rounded-lg" />
      <div className="h-4 w-2/3 shimmer rounded-lg" />
      <div className="flex gap-2 pt-2">
        <div className="h-6 w-16 shimmer rounded-full" />
        <div className="h-6 w-20 shimmer rounded-full" />
      </div>
    </div>
  );
}
