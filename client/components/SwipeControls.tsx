'use client';

import React, { useEffect } from 'react';
import { X, Heart, Loader2 } from 'lucide-react';
import { SwipeAction } from '../lib/types';

interface SwipeControlsProps {
  onSwipe: (action: SwipeAction) => void;
  disabled?: boolean;
}

export default function SwipeControls({
  onSwipe,
  disabled = false,
}: SwipeControlsProps) {
  // Keyboard navigation support: Left Arrow = Pass, Right Arrow = Like
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (disabled) return;
      if (e.key === 'ArrowLeft') {
        onSwipe('pass');
      } else if (e.key === 'ArrowRight') {
        onSwipe('like');
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [disabled, onSwipe]);

  return (
    <div className="w-full max-w-sm mx-auto flex items-center justify-center gap-8 py-4">
      {/* Pass Button */}
      <div className="flex flex-col items-center gap-1">
        <button
          onClick={() => onSwipe('pass')}
          disabled={disabled}
          aria-label="Pass profile (Left Arrow)"
          title="Pass (Left Arrow)"
          className={`w-16 h-16 rounded-full flex items-center justify-center bg-white border-2 border-slate-200 text-slate-500 shadow-md hover:border-rose-300 hover:text-rose-500 hover:shadow-lg active:scale-95 transition-all ${
            disabled ? 'opacity-50 cursor-not-allowed scale-95' : 'hover:scale-105'
          }`}
        >
          {disabled ? (
            <Loader2 className="w-6 h-6 animate-spin text-slate-400" />
          ) : (
            <X className="w-7 h-7 stroke-[2.5]" />
          )}
        </button>
        <span className="text-[11px] font-medium text-slate-400 hidden sm:inline">
          Pass (←)
        </span>
      </div>

      {/* Like Button */}
      <div className="flex flex-col items-center gap-1">
        <button
          onClick={() => onSwipe('like')}
          disabled={disabled}
          aria-label="Like profile (Right Arrow)"
          title="Like (Right Arrow)"
          className={`w-16 h-16 rounded-full flex items-center justify-center bg-gradient-to-tr from-rose-500 to-pink-500 text-white shadow-lg shadow-rose-500/30 hover:shadow-rose-500/50 hover:from-rose-600 hover:to-pink-600 active:scale-95 transition-all ${
            disabled ? 'opacity-50 cursor-not-allowed scale-95' : 'hover:scale-105'
          }`}
        >
          {disabled ? (
            <Loader2 className="w-6 h-6 animate-spin text-white" />
          ) : (
            <Heart className="w-7 h-7 fill-white stroke-white stroke-[2]" />
          )}
        </button>
        <span className="text-[11px] font-medium text-rose-500 hidden sm:inline">
          Like (→)
        </span>
      </div>
    </div>
  );
}

