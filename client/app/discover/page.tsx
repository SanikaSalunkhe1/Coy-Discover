'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { AnimatePresence } from 'framer-motion';
import { AlertCircle, RefreshCw } from 'lucide-react';
import ProfileCard from '../../components/ProfileCard';
import SwipeControls from '../../components/SwipeControls';
import MatchModal from '../../components/MatchModal';
import EmptyFeed from '../../components/EmptyFeed';
import LoadingState from '../../components/LoadingState';
import { fetchFeed, submitSwipe } from '../../lib/api';
import { Profile, SwipeAction } from '../../lib/types';

export default function DiscoverPage() {
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);
  const [swiping, setSwiping] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [matchedProfile, setMatchedProfile] = useState<Profile | null>(null);

  const loadFeed = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await fetchFeed();
      setProfiles(data);
      setCurrentIndex(0);
    } catch (err: any) {
      setError(err.message || 'Unable to connect to server. Please ensure the backend is running.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadFeed();
  }, [loadFeed]);

  const handleSwipe = async (action: SwipeAction) => {
    if (swiping || currentIndex >= profiles.length) return;

    const currentProfile = profiles[currentIndex];
    setSwiping(true);

    try {
      // 1. Submit swipe to backend
      const result = await submitSwipe(currentProfile.id, action);

      // 2. If backend confirms mutual match, celebrate!
      if (result.isMatch) {
        setMatchedProfile(currentProfile);
      }

      // 3. Advance to the next profile only after server persistence confirms
      setCurrentIndex((prev) => prev + 1);
    } catch (err: any) {
      alert(`Could not save swipe: ${err.message || 'Server error'}`);
    } finally {
      setSwiping(false);
    }
  };

  const currentProfile = profiles[currentIndex];
  const remainingCount = profiles.length - currentIndex;

  return (
    <div className="flex-1 flex flex-col justify-between items-center py-2">
      {/* Header Info / Progress Tracker */}
      <div className="w-full max-w-sm flex items-center justify-between text-xs text-slate-500 mb-3 px-2">
        <span className="font-medium text-slate-700">Discover People</span>
        {!loading && profiles.length > 0 && remainingCount > 0 && (
          <span className="bg-slate-200/80 px-2.5 py-0.5 rounded-full font-semibold text-slate-600">
            {remainingCount} {remainingCount === 1 ? 'profile' : 'profiles'} left
          </span>
        )}
      </div>

      {/* Main Content Area */}
      <div className="w-full flex-1 flex flex-col justify-center items-center">
        {loading ? (
          <LoadingState />
        ) : error ? (
          <div className="w-full max-w-sm bg-white rounded-3xl p-6 border border-rose-100 shadow-md text-center flex flex-col items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-rose-50 text-rose-500 flex items-center justify-center">
              <AlertCircle className="w-6 h-6" />
            </div>
            <h2 className="text-base font-bold text-slate-800">Connection Error</h2>
            <p className="text-xs text-slate-500 leading-relaxed">{error}</p>
            <button
              onClick={loadFeed}
              className="mt-2 py-2 px-4 rounded-xl bg-rose-500 hover:bg-rose-600 text-white text-xs font-semibold flex items-center gap-2 shadow-sm transition-all"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Retry</span>
            </button>
          </div>
        ) : currentProfile ? (
          <div className="w-full flex flex-col items-center">
            <AnimatePresence mode="wait">
              <ProfileCard
                key={currentProfile.id}
                profile={currentProfile}
                onSwipe={handleSwipe}
                disabled={swiping}
              />
            </AnimatePresence>

            {/* Desktop and Mobile Controls */}
            <SwipeControls onSwipe={handleSwipe} disabled={swiping} />
          </div>
        ) : (
          <EmptyFeed onRefresh={loadFeed} loading={loading} />
        )}
      </div>

      {/* Mutual Match Celebration Modal */}
      <MatchModal
        matchedProfile={matchedProfile}
        onClose={() => setMatchedProfile(null)}
      />
    </div>
  );
}

