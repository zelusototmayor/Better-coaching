'use client';

import Link from 'next/link';
import { AppPreview } from './AppPreview';

export function Hero() {
  return (
    <section className="section pt-12 sm:pt-16 lg:pt-20">
      <div className="container-landing">
        <div className="text-center max-w-3xl mx-auto animate-fade-up">
          <h1 className="heading-hero">
            Better Coaching: AI Leadership Coaching for Founders & Remote Teams
          </h1>

          <p className="mt-6 text-lg sm:text-xl body-text leading-relaxed">
            Scalable executive coaching for modern teams. Practice difficult conversations, run weekly reflection loops, and improve decision quality with expert-built AI agents.
          </p>

          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/login"
              className="btn btn-primary text-base px-8 py-3.5 w-full sm:w-auto"
            >
              Create your agent
            </Link>
            <a
              href="#"
              className="btn btn-outline text-base px-8 py-3.5 w-full sm:w-auto"
            >
              Find your coach
            </a>
          </div>
        </div>

        <div className="mt-16 sm:mt-20 animate-fade-up" style={{ animationDelay: '200ms' }}>
          <AppPreview />
        </div>
      </div>
    </section>
  );
}
