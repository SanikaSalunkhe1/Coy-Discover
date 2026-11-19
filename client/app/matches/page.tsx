'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { Heart, Calendar, MapPin, GraduationCap, Compass, Sparkles, RefreshCw, AlertCircle } from 'lucide-react';
import { fetchMatches } from '../../lib/api';
import { MatchProfile } from '../../lib/types';

export default function MatchesPage() {
  const [matches, setMatches] = useState<MatchProfile[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const loadMatches = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await fetchMatches();
      setMatches(data);
    } catch (err: any) {
      setError(err.message || 'Failed to load matches');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadMatches();
  }, [loadMatches]);

  const formatDate = (isoString: string) => {
    try {
      const date = new Date(isoString);
      return new Intl.DateTimeFormat('en-US', {
        month: 'short',
        day: 'numeric',
        hour: 'numeric',
        minute: '2-digit',
      }).format(date);
    } catch {
      return 'Recently';
    }
  };

  return (
    <div className="flex-1 flex flex-col py-2 max-w-sm mx-auto w-full">
      {/* Header */}
      <div className="flex items-center justify-between mb-4 px-1">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <span>Matches</span>
            <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-rose-100 text-rose-700">
              {matches.length}
            </span>
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Connections where both of you expressed mutual interest
          </p>
        </div>

        <button
          onClick={loadMatches}
          disabled={loading}
          aria-label="Refresh matches"
          className="p-2 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
        </button>
      </div>

      {/* Main Content Area */}
      {loading ? (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="bg-white rounded-2xl p-4 border border-slate-100 shadow-sm flex items-center gap-3 animate-pulse"
            >
              <div className="w-14 h-14 rounded-full bg-slate-200 shrink-0" />
              <div className="flex-1 space-y-2">
                <div className="h-4 bg-slate-200 rounded w-1/2" />
                <div className="h-3 bg-slate-200 rounded w-3/4" />
              </div>
            </div>
          ))}
        </div>
      ) : error ? (
        <div className="bg-white rounded-3xl p-6 border border-rose-100 shadow-sm text-center flex flex-col items-center gap-3 my-auto">
          <div className="w-12 h-12 rounded-full bg-rose-50 text-rose-500 flex items-center justify-center">
            <AlertCircle className="w-6 h-6" />
          </div>
          <h2 className="text-base font-bold text-slate-800">Unable to Load Matches</h2>
          <p className="text-xs text-slate-500">{error}</p>
          <button
            onClick={loadMatches}
            className="mt-2 py-2 px-4 rounded-xl bg-rose-500 hover:bg-rose-600 text-white text-xs font-semibold flex items-center gap-2 transition-colors"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Retry</span>
          </button>
        </div>
      ) : matches.length === 0 ? (
        /* Empty Matches State */
        <div className="bg-white rounded-3xl p-8 border border-slate-100 shadow-md text-center flex flex-col items-center gap-4 my-auto">
          <div className="w-16 h-16 rounded-full bg-rose-50 text-rose-400 flex items-center justify-center">
            <Heart className="w-8 h-8 stroke-[1.8]" />
          </div>
          <div className="space-y-1">
            <h2 className="text-xl font-bold text-slate-800 tracking-tight">
              No Matches Yet
            </h2>
            <p className="text-xs text-slate-500 leading-relaxed max-w-xs">
              Keep exploring the Discover tab. When someone you like also likes you back, they will appear right here!
            </p>
          </div>
          <Link
            href="/discover"
            className="mt-2 w-full py-3 px-4 rounded-2xl bg-gradient-to-r from-rose-500 to-pink-500 text-white font-semibold text-xs flex items-center justify-center gap-2 shadow-md shadow-rose-500/20 active:scale-95 transition-all"
          >
            <Compass className="w-4 h-4" />
            <span>Start Swiping in Discover</span>
          </Link>
        </div>
      ) : (
        /* Matches List */
        <div className="space-y-3 pb-4">
          {matches.map((match) => (
            <div
              key={match.id}
              className="bg-white rounded-2xl p-4 border border-slate-100 shadow-sm hover:shadow-md transition-shadow flex flex-col gap-3"
            >
              <div className="flex items-center gap-3.5">
                <div className="relative w-14 h-14 rounded-full border-2 border-rose-100 bg-rose-50 overflow-hidden shrink-0">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={match.photo}
                    alt={match.name}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute bottom-0 right-0 w-4 h-4 rounded-full bg-emerald-500 border-2 border-white" />
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-1">
                    <h2 className="font-bold text-base text-slate-900 truncate">
                      {match.name}, <span className="font-normal text-slate-500">{match.age}</span>
                    </h2>
                    <span className="text-[10px] text-slate-400 flex items-center gap-1 shrink-0">
                      <Calendar className="w-3 h-3" />
                      {formatDate(match.matchedAt)}
                    </span>
                  </div>

                  <div className="flex items-center gap-2 text-xs text-slate-500 mt-0.5 truncate">
                    {match.city && (
                      <span className="flex items-center gap-0.5 truncate">
                        <MapPin className="w-3 h-3 text-slate-400 shrink-0" />
                        <span className="truncate">{match.city}</span>
                      </span>
                    )}
                    {match.college && (
                      <span className="flex items-center gap-0.5 truncate">
                        <GraduationCap className="w-3 h-3 text-slate-400 shrink-0" />
                        <span className="truncate">{match.college}</span>
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {match.bio && (
                <p className="text-xs text-slate-600 line-clamp-2 italic bg-slate-50 p-2 rounded-xl">
                  &ldquo;{match.bio}&rdquo;
                </p>
              )}

              {/* Interests Tags */}
              <div className="flex flex-wrap gap-1 items-center">
                <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider mr-1">
                  Interests:
                </span>
                {match.interests.map((interest) => (
                  <span
                    key={interest}
                    className="text-[11px] px-2 py-0.5 rounded-full bg-rose-50 text-rose-700 font-medium border border-rose-100"
                  >
                    {interest}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

