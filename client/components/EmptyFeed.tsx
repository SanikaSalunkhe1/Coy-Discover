'use client';

import React from 'react';
import Link from 'next/link';
import { Compass, RefreshCw, Heart } from 'lucide-react';

interface EmptyFeedProps {
  onRefresh: () => void;
  loading?: boolean;
}

export default function EmptyFeed({ onRefresh, loading = false }: EmptyFeedProps) {
  return (
    <div className="w-full max-w-sm mx-auto bg-white rounded-3xl p-8 border border-slate-100 shadow-lg text-center flex flex-col items-center gap-4 my-auto">
      <div className="w-20 h-20 rounded-full bg-rose-50 flex items-center justify-center text-rose-500 mb-2">
        <Compass className="w-10 h-10 stroke-[1.8]" />
      </div>

      <div className="flex flex-col gap-1">
        <h2 className="text-2xl font-bold text-slate-800 tracking-tight">
          You&apos;re All Caught Up!
        </h2>
        <p className="text-sm text-slate-500 leading-relaxed max-w-xs">
          You have reviewed all available profiles in your area. New people will appear here as they join!
        </p>
      </div>

      <div className="w-full flex flex-col gap-2 mt-4">
        <button
          onClick={onRefresh}
          disabled={loading}
          className="w-full py-3 px-4 rounded-2xl bg-rose-500 hover:bg-rose-600 text-white font-semibold text-sm flex items-center justify-center gap-2 shadow-md shadow-rose-500/20 active:scale-95 transition-all disabled:opacity-60"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          <span>{loading ? 'Checking Feed...' : 'Check for New Profiles'}</span>
        </button>

        <Link
          href="/matches"
          className="w-full py-3 px-4 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-sm flex items-center justify-center gap-2 transition-colors"
        >
          <Heart className="w-4 h-4 text-rose-500 fill-rose-500" />
          <span>Go to My Matches</span>
        </Link>
      </div>
    </div>
  );
}

