'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/lib/store';
import {
  Navigation,
  Hero,
  ValuePillars,
  HowItWorks,
  Categories,
  FooterCTA,
} from '@/components/landing';

export default function Home() {
  const router = useRouter();
  const { isAuthenticated } = useAuthStore();

  useEffect(() => {
    if (isAuthenticated) {
      router.replace('/dashboard');
    }
  }, [isAuthenticated, router]);

  if (isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-sky-600"></div>
      </div>
    );
  }

  return (
    <main className="min-h-screen">
      <Navigation />
      <Hero />
      <ValuePillars />
      <HowItWorks />
      <Categories />
      <FooterCTA />
    </main>
  );
}
