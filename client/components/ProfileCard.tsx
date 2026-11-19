'use client';

import React from 'react';
import { motion, useMotionValue, useTransform } from 'framer-motion';
import { MapPin, GraduationCap, Sparkles, CheckCircle2 } from 'lucide-react';
import { Profile, SwipeAction } from '../lib/types';

interface ProfileCardProps {
  profile: Profile;
  onSwipe: (action: SwipeAction) => void;
  disabled?: boolean;
}

export default function ProfileCard({
  profile,
  onSwipe,
  disabled = false,
}: ProfileCardProps) {
  const x = useMotionValue(0);

  // Card tilts naturally with drag distance
  const rotate = useTransform(x, [-200, 200], [-18, 18]);

  // Dynamic stamp opacity for visual feedback
  const likeOpacity = useTransform(x, [20, 100], [0, 1]);
  const passOpacity = useTransform(x, [-20, -100], [0, 1]);

  const handleDragEnd = (
    _event: MouseEvent | TouchEvent | PointerEvent,
    info: { offset: { x: number; y: number } }
  ) => {
    if (disabled) return;
    const threshold = 90; // Pixels required to trigger swipe
    if (info.offset.x > threshold) {
      onSwipe('like');
    } else if (info.offset.x < -threshold) {
      onSwipe('pass');
    }
  };

  return (
    <div className="relative w-full max-w-sm mx-auto select-none">
      <motion.div
        style={{ x, rotate }}
        drag={disabled ? false : 'x'}
        dragConstraints={{ left: 0, right: 0 }}
        dragElastic={0.7}
        onDragEnd={handleDragEnd}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        transition={{ type: 'spring', damping: 25, stiffness: 300 }}
        className={`relative w-full bg-white rounded-3xl overflow-hidden shadow-xl border border-slate-100 flex flex-col cursor-grab active:cursor-grabbing ${
          disabled ? 'opacity-80 pointer-events-none' : ''
        }`}
      >
        {/* Dynamic LIKE / PASS Visual Stamps */}
        <motion.div
          style={{ opacity: likeOpacity }}
          className="absolute top-6 left-6 z-30 pointer-events-none border-4 border-emerald-500 rounded-2xl px-4 py-1.5 rotate-[-12deg] bg-emerald-500/10 backdrop-blur-sm"
        >
          <span className="text-emerald-600 font-extrabold text-2xl tracking-wider">
            LIKE
          </span>
        </motion.div>

        <motion.div
          style={{ opacity: passOpacity }}
          className="absolute top-6 right-6 z-30 pointer-events-none border-4 border-rose-500 rounded-2xl px-4 py-1.5 rotate-[12deg] bg-rose-500/10 backdrop-blur-sm"
        >
          <span className="text-rose-600 font-extrabold text-2xl tracking-wider">
            PASS
          </span>
        </motion.div>

        {/* Profile Avatar & Header Visual */}
        <div className="relative w-full aspect-[4/3] bg-gradient-to-b from-slate-100 to-slate-200 flex items-center justify-center p-6 overflow-hidden">
          <div className="w-36 h-36 rounded-full shadow-lg border-4 border-white overflow-hidden bg-white flex items-center justify-center">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={profile.photo}
              alt={profile.name}
              className="w-full h-full object-cover"
              draggable={false}
            />
          </div>

          {/* Subtitle Badge */}
          <div className="absolute bottom-3 left-4 right-4 flex items-center justify-between text-xs text-slate-700 bg-white/80 backdrop-blur-md py-1.5 px-3 rounded-full border border-white/60 shadow-sm">
            <span className="flex items-center gap-1 font-medium truncate">
              <GraduationCap className="w-3.5 h-3.5 text-slate-500 shrink-0" />
              <span className="truncate">{profile.college}</span>
            </span>
            <span className="flex items-center gap-1 font-medium shrink-0 ml-2">
              <MapPin className="w-3.5 h-3.5 text-slate-500 shrink-0" />
              <span>{profile.city}</span>
            </span>
          </div>
        </div>

        {/* Profile Content Details */}
        <div className="p-5 flex flex-col gap-4">
          {/* Name & Age */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <h2 className="text-2xl font-bold text-slate-900 tracking-tight">
                {profile.name}
              </h2>
              <span className="text-2xl font-light text-slate-400">
                {profile.age}
              </span>
              <CheckCircle2 className="w-5 h-5 text-rose-500 fill-rose-500/10 shrink-0" />
            </div>
          </div>

          {/* Bio */}
          <p className="text-sm text-slate-600 leading-relaxed">
            {profile.bio}
          </p>

          {/* Shared Interests Highlight ("You both like") */}
          {profile.sharedInterests && profile.sharedInterests.length > 0 && (
            <div className="rounded-2xl bg-gradient-to-r from-rose-50 via-pink-50 to-amber-50 p-3 border border-rose-100/70">
              <div className="flex items-center gap-1.5 text-xs font-semibold text-rose-700 mb-2">
                <Sparkles className="w-3.5 h-3.5 fill-rose-600 text-rose-600" />
                <span>You both like</span>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {profile.sharedInterests.map((interest) => (
                  <span
                    key={interest}
                    className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-white text-rose-700 shadow-sm border border-rose-200/80"
                  >
                    ✨ {interest}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* All Interests */}
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
              Interests
            </h3>
            <div className="flex flex-wrap gap-1.5">
              {profile.interests.map((interest) => {
                const isShared = profile.sharedInterests?.includes(interest);
                return (
                  <span
                    key={interest}
                    className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium transition-colors ${
                      isShared
                        ? 'bg-rose-100/80 text-rose-800 border border-rose-200 font-semibold'
                        : 'bg-slate-100 text-slate-700'
                    }`}
                  >
                    {interest}
                  </span>
                );
              })}
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

