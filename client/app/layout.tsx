import type { Metadata } from 'next';
import './globals.css';
import Navbar from '../components/Navbar';

export const metadata: Metadata = {
  title: 'Coy Discover — Interest-Based, Privacy-First Connection',
  description:
    'Discover relevant people beyond contacts you already know with private Like/Pass actions and server-side mutual matching.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-slate-50 text-slate-900 flex flex-col antialiased">
        <Navbar />
        <main className="flex-1 max-w-md w-full mx-auto p-4 flex flex-col justify-start pb-20 sm:pb-8">
          {children}
        </main>
      </body>
    </html>
  );
}

