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

        <div className="mt-10 grid gap-6 md:grid-cols-4">
          <article className="rounded-2xl border border-slate-200 p-6">
            <h3 className="text-xl font-semibold text-slate-900">Team meeting prep coaching</h3>
            <p className="mt-3 text-slate-700">
              Rehearse difficult updates, sharpen talking points, and enter leadership meetings with clearer decisions.
            </p>
          </article>
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

function SEOFAQ() {
  return (
    <section className="bg-slate-50 px-4 py-20">
      <div className="mx-auto max-w-4xl">
        <h2 className="text-3xl font-bold text-slate-900 md:text-4xl">AI coaching FAQ for practical buyers</h2>
        <p className="mt-4 text-lg text-slate-600">
          Quick answers for founders and operators comparing AI coaching tools before committing.
        </p>

        <div className="mt-10 space-y-6">
          <article className="rounded-2xl border border-slate-200 bg-white p-6">
            <h3 className="text-xl font-semibold text-slate-900">How is Better Coaching different from generic AI chat tools?</h3>
            <p className="mt-3 text-slate-700">
              Better Coaching uses expert-built coaching methodologies instead of blank-chat prompts. You get structured frameworks,
              accountability loops, and guidance designed for repeatable behavior change.
            </p>
          </article>

          <article className="rounded-2xl border border-slate-200 bg-white p-6">
            <h3 className="text-xl font-semibold text-slate-900">Can startup teams use Better Coaching for leadership development?</h3>
            <p className="mt-3 text-slate-700">
              Yes. Teams use it for manager communication practice, weekly reflection workflows, and decision-support routines that
              improve execution consistency.
            </p>
          </article>

          <article className="rounded-2xl border border-slate-200 bg-white p-6">
            <h3 className="text-xl font-semibold text-slate-900">What is the best first workflow to start with?</h3>
            <p className="mt-3 text-slate-700">
              Start with a 15-minute daily decision review: define one priority, pressure-test tradeoffs, and commit to one measurable
              action before ending the session.
            </p>
          </article>

          <article className="rounded-2xl border border-slate-200 bg-white p-6">
            <h3 className="text-xl font-semibold text-slate-900">Is Better Coaching suitable for executive leadership development?</h3>
            <p className="mt-3 text-slate-700">
              Better Coaching is an ideal tool for executive leadership development and corporate training. It provides a scalable, private way for leaders to practice high-stakes communication, pressure-test strategy, and develop emotional intelligence using proven coaching frameworks.
            </p>
          </article>

          <article className="rounded-2xl border border-slate-200 bg-white p-6">
            <h3 className="text-xl font-semibold text-slate-900">How does AI coaching help with founder burnout and accountability?</h3>
            <p className="mt-3 text-slate-700">
              AI coaching helps founders manage cognitive load by providing structured reflection spaces. Better Coaching focuses on clear prioritization and daily accountability loops, helping founders stay focused on high-leverage work while reducing the mental friction of decision-making.
            </p>
          </article>
        </div>
      </div>
    </section>
  );
}

function ComparisonSection() {
  return (
    <section className="bg-slate-50 px-4 py-20">
      <div className="mx-auto max-w-5xl">
        <h2 className="text-3xl font-bold text-slate-900 md:text-4xl">
          Better Coaching vs generic AI chatbots
        </h2>
        <p className="mt-4 max-w-3xl text-lg text-slate-600">
          Generic chatbots answer questions. Better Coaching delivers expert-built coaching systems with repeatable frameworks,
          accountability structure, and outcomes you can track.
        </p>

        <div className="mt-10 grid gap-6 md:grid-cols-2">
          <article className="rounded-2xl border border-slate-200 bg-white p-6">
            <h3 className="text-xl font-semibold text-slate-900">Structured coaching, not random chat</h3>
            <p className="mt-3 text-slate-700">
              Every coach agent follows a methodology with practical exercises, reflection prompts, and weekly execution loops.
            </p>
          </article>
          <article className="rounded-2xl border border-slate-200 bg-white p-6">
            <h3 className="text-xl font-semibold text-slate-900">Built for creators, founders, and teams</h3>
            <p className="mt-3 text-slate-700">
              Use Better Coaching for leadership decisions, accountability systems, communication practice, and performance growth.
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
      <ComparisonSection />
      <SEOFAQ />
      <FooterCTA />
    </main>
  );
}
