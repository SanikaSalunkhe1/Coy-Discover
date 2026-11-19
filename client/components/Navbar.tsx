'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Compass, Heart, Home, Sparkles } from 'lucide-react';

export default function Navbar() {
  const pathname = usePathname();

  const navItems = [
    { label: 'Home', href: '/', icon: Home },
    { label: 'Discover', href: '/discover', icon: Compass },
    { label: 'Matches', href: '/matches', icon: Heart },
  ];

  return (
    <>
      {/* Top Bar for Desktop & Mobile Header */}
      <header className="sticky top-0 z-40 w-full bg-white/80 backdrop-blur-md border-b border-slate-100 shadow-sm">
        <div className="max-w-md mx-auto px-4 h-14 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-rose-500 to-pink-500 flex items-center justify-center text-white shadow-md shadow-rose-500/20 group-hover:scale-105 transition-transform">
              <Sparkles className="w-4 h-4 fill-white" />
            </div>
            <div className="flex flex-col">
              <span className="font-bold text-lg tracking-tight bg-gradient-to-r from-rose-600 to-pink-600 bg-clip-text text-transparent">
                Coy Discover
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden sm:flex items-center gap-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`px-3 py-1.5 rounded-full text-sm font-medium flex items-center gap-1.5 transition-all ${
                    isActive
                      ? 'bg-rose-50 text-rose-600'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'stroke-rose-600' : 'stroke-slate-500'}`} />
                  {item.label}
                </Link>
              );
            })}
          </nav>

          {/* Privacy Badge */}
          <div className="text-xs px-2.5 py-1 rounded-full bg-slate-100 text-slate-600 font-medium">
            🔒 Private
          </div>
        </div>
      </header>

      {/* Bottom Sticky Tab Bar for Mobile */}
      <nav className="sm:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/90 backdrop-blur-lg border-t border-slate-200/80 shadow-lg px-6 py-2 pb-safe">
        <div className="max-w-md mx-auto flex items-center justify-around">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex flex-col items-center justify-center py-1 px-4 rounded-2xl transition-all ${
                  isActive
                    ? 'text-rose-600 font-semibold'
                    : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                <div
                  className={`p-1 rounded-xl transition-all ${
                    isActive ? 'bg-rose-50' : ''
                  }`}
                >
                  <Icon className={`w-5 h-5 ${isActive ? 'stroke-rose-600 stroke-[2.5]' : 'stroke-slate-500'}`} />
                </div>
                <span className="text-[11px] mt-0.5">{item.label}</span>
              </Link>
            );
          })}
        </div>
      </nav>
    </>
  );
}

