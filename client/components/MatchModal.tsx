'use client';

import React, { useEffect } from 'react';
import Link from 'next/link';
import confetti from 'canvas-confetti';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, Sparkles, ArrowRight, MessageCircle } from 'lucide-react';
import { Profile } from '../lib/types';

interface MatchModalProps {
  matchedProfile: Profile | null;
  onClose: () => void;
}

export default function MatchModal({
  matchedProfile,
  onClose,
}: MatchModalProps) {
  useEffect(() => {
    if (matchedProfile) {
      // Fire celebration confetti
      const end = Date.now() + 1.5 * 1000;
      const colors = ['#f43f5e', '#ec4899', '#8b5cf6', '#3b82f6'];

      (function frame() {
        confetti({
          particleCount: 3,
          angle: 60,
          spread: 55,
          origin: { x: 0 },
          colors: colors,
        });
        confetti({
          particleCount: 3,
          angle: 120,
          spread: 55,
          origin: { x: 1 },
          colors: colors,
        });

        if (Date.now() < end) {
          requestAnimationFrame(frame);
        }
      })();
    }
  }, [matchedProfile]);

  if (!matchedProfile) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-md">
        <motion.div
          initial={{ scale: 0.8, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.8, opacity: 0, y: 20 }}
          transition={{ type: 'spring', damping: 22, stiffness: 260 }}
          className="relative w-full max-w-sm bg-white rounded-3xl p-6 shadow-2xl text-center overflow-hidden border border-rose-100"
        >
          {/* Header Tag */}
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-50 text-rose-600 text-xs font-semibold mb-3">
            <Sparkles className="w-3.5 h-3.5 fill-rose-500" />
            <span>Mutual Connection</span>
          </div>

          <h2 className="text-3xl font-extrabold tracking-tight bg-gradient-to-r from-rose-600 via-pink-600 to-amber-600 bg-clip-text text-transparent mb-1">
            It&apos;s a Match!
          </h2>
          <p className="text-sm text-slate-500 mb-6">
            You and <span className="font-semibold text-slate-800">{matchedProfile.name}</span> both liked each other.
          </p>

          {/* Profile Avatars Connection Display */}
          <div className="flex items-center justify-center gap-3 mb-6">
            <div className="relative">
              <div className="w-20 h-20 rounded-full border-4 border-white shadow-lg overflow-hidden bg-rose-100 flex items-center justify-center">
                {/* Demo User Avatar */}
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/avatars/avatar-01.svg"
                  alt="You"
                  className="w-full h-full object-cover"
                />
              </div>
              <span className="text-[10px] font-semibold text-slate-500 mt-1 block">
                You
              </span>
            </div>

            <div className="w-10 h-10 rounded-full bg-rose-500 text-white flex items-center justify-center shadow-md animate-pulse">
              <Heart className="w-5 h-5 fill-white stroke-white" />
            </div>

            <div className="relative">
              <div className="w-20 h-20 rounded-full border-4 border-white shadow-lg overflow-hidden bg-pink-100 flex items-center justify-center">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={matchedProfile.photo}
                  alt={matchedProfile.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <span className="text-[10px] font-semibold text-slate-500 mt-1 block truncate max-w-[80px]">
                {matchedProfile.name.split(' ')[0]}
              </span>
            </div>
          </div>

          {/* Shared Interests Highlight */}
          {matchedProfile.sharedInterests && matchedProfile.sharedInterests.length > 0 && (
            <div className="bg-rose-50/60 rounded-2xl p-3 mb-6 text-left border border-rose-100">
              <span className="text-xs font-semibold text-rose-800 block mb-1.5">
                💡 Great conversation starters:
              </span>
              <div className="flex flex-wrap gap-1">
                {matchedProfile.sharedInterests.map((interest) => (
                  <span
                    key={interest}
                    className="text-xs bg-white text-rose-700 px-2.5 py-0.5 rounded-full font-medium shadow-sm border border-rose-200"
                  >
                    {interest}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex flex-col gap-2.5">
            <Link
              href="/matches"
              onClick={onClose}
              className="w-full py-3 px-4 rounded-2xl bg-gradient-to-r from-rose-500 to-pink-500 text-white font-semibold text-sm shadow-md shadow-rose-500/25 hover:from-rose-600 hover:to-pink-600 flex items-center justify-center gap-2 transition-transform active:scale-95"
            >
              <span>View All Matches</span>
              <ArrowRight className="w-4 h-4" />
            </Link>

            <button
              onClick={onClose}
              className="w-full py-2.5 px-4 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium text-sm transition-colors"
            >
              Keep Swiping
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}

