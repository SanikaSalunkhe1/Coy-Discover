import Link from 'next/link';
import { Compass, ShieldCheck, Heart, Sparkles, ArrowRight } from 'lucide-react';

export default function HomePage() {
  return (
    <div className="flex-1 flex flex-col justify-center items-center text-center px-4 py-8 max-w-sm mx-auto">

      {/* Main Headline */}
      <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900 mb-3">
        Discover connections,{' '}
        <span className="bg-gradient-to-r from-rose-600 to-pink-600 bg-clip-text text-transparent">
          not just profiles.
        </span>
      </h1>

      <p className="text-sm text-slate-600 leading-relaxed mb-8">
        Discover people through shared interests, college, and city. Express interest privately with zero one-sided like exposure.
      </p>

      {/* Primary CTA */}
      <Link
        href="/discover"
        className="w-full py-3.5 px-6 rounded-2xl bg-gradient-to-r from-rose-500 to-pink-500 hover:from-rose-600 hover:to-pink-600 text-white font-semibold text-base shadow-lg shadow-rose-500/25 flex items-center justify-center gap-2 group transition-all active:scale-95 mb-6"
      >
        <Compass className="w-5 h-5 group-hover:rotate-45 transition-transform" />
        <span>Start Discovering</span>
        <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
      </Link>

      {/* Three Feature Highlights */}
      <div className="w-full grid grid-cols-1 gap-3 text-left">
        <div className="flex items-start gap-3 p-3.5 rounded-2xl bg-white border border-slate-100 shadow-sm">
          <div className="p-2 rounded-xl bg-emerald-50 text-emerald-600 shrink-0">
            <ShieldCheck className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-xs font-semibold text-slate-800">Privacy-First Matching</h2>
            <p className="text-xs text-slate-500 mt-0.5">
              One-sided likes are strictly server-side. No secret admirer badges or pressure.
            </p>
          </div>
        </div>

        <div className="flex items-start gap-3 p-3.5 rounded-2xl bg-white border border-slate-100 shadow-sm">
          <div className="p-2 rounded-xl bg-purple-50 text-purple-600 shrink-0">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-xs font-semibold text-slate-800">Interest-Based Feed</h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Deterministic Jaccard similarity sorts profiles by shared interests automatically.
            </p>
          </div>
        </div>

        <div className="flex items-start gap-3 p-3.5 rounded-2xl bg-white border border-slate-100 shadow-sm">
          <div className="p-2 rounded-xl bg-rose-50 text-rose-600 shrink-0">
            <Heart className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-xs font-semibold text-slate-800">Mutual Connections</h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Matches appear only when both users express genuine interest.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

