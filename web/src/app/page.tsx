import {
  Navigation,
  Hero,
  ValuePillars,
  HowItWorks,
  Categories,
  FooterCTA,
} from '@/components/landing';
import { AuthRedirect } from '@/components/landing/AuthRedirect';

function SEOUseCases() {
  return (
    <section className="bg-white px-4 py-20">
      <div className="mx-auto max-w-5xl">
        <h2 className="text-3xl font-bold text-slate-900 md:text-4xl">
          AI coaching use cases for founders, creators, and teams
        </h2>
        <p className="mt-4 max-w-3xl text-lg text-slate-600">
          Better Coaching is designed for practical outcomes: better decision-making, stronger communication, and consistent execution.
          Choose an expert-built agent and apply a framework daily.
        </p>

        <div className="mt-10 grid gap-6 md:grid-cols-3">
          <article className="rounded-2xl border border-slate-200 p-6">
            <h3 className="text-xl font-semibold text-slate-900">Founder decision support</h3>
            <p className="mt-3 text-slate-700">
              Pressure-test strategy choices, prepare investor updates, and clarify positioning before high-stakes conversations.
            </p>
          </article>
          <article className="rounded-2xl border border-slate-200 p-6">
            <h3 className="text-xl font-semibold text-slate-900">Career and leadership coaching</h3>
            <p className="mt-3 text-slate-700">
              Practice difficult conversations, strengthen delegation, and run weekly reflection loops with a consistent coaching method.
            </p>
          </article>
          <article className="rounded-2xl border border-slate-200 p-6">
            <h3 className="text-xl font-semibold text-slate-900">Creator accountability systems</h3>
            <p className="mt-3 text-slate-700">
              Break large goals into daily actions, track habits, and stay in momentum with structured prompts from your chosen coach.
            </p>
          </article>
        </div>
      </div>
    </section>
  );
}

export default function Home() {
  return (
    <main className="min-h-screen">
      <AuthRedirect />
      <Navigation />
      <Hero />
      <ValuePillars />
      <HowItWorks />
      <Categories />
      <SEOUseCases />
      <FooterCTA />
    </main>
  );
}
