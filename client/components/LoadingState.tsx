'use client';

import React from 'react';

export default function LoadingState() {
  return (
    <div className="w-full max-w-sm mx-auto bg-white rounded-3xl p-5 border border-slate-100 shadow-xl flex flex-col gap-4 animate-pulse">
      {/* Avatar skeleton */}
      <div className="w-full aspect-[4/3] bg-slate-200 rounded-2xl flex items-center justify-center">
        <div className="w-28 h-28 rounded-full bg-slate-300" />
      </div>

      {/* Title & Age skeleton */}
      <div className="flex items-center gap-3">
        <div className="h-7 bg-slate-200 rounded-lg w-3/5" />
        <div className="h-7 bg-slate-200 rounded-lg w-1/6" />
      </div>

      {/* Bio lines */}
      <div className="space-y-2">
        <div className="h-4 bg-slate-200 rounded w-full" />
        <div className="h-4 bg-slate-200 rounded w-4/5" />
      </div>

      {/* Chips skeleton */}
      <div className="flex flex-wrap gap-2 pt-2">
        <div className="h-6 w-20 bg-slate-200 rounded-full" />
        <div className="h-6 w-16 bg-slate-200 rounded-full" />
        <div className="h-6 w-24 bg-slate-200 rounded-full" />
      </div>
    </div>
  );
}

