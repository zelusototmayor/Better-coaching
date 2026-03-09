import {
  Navigation,
  Hero,
  ValuePillars,
  HowItWorks,
  Categories,
  FooterCTA,
  Comparison,
} from '@/components/landing';
import { AuthRedirect } from '@/components/landing/AuthRedirect';

function SEOUseCases() {
  return (
    <section id="use-cases" className="bg-white px-4 py-20">
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
          <article className="rounded-2xl border border-slate-200 p-6">
            <h3 className="text-xl font-semibold text-slate-900">Remote team coaching</h3>
            <p className="mt-3 text-slate-700">
              Distributed teams lose alignment fast. Use AI coaching to run async check-ins, practice difficult feedback conversations, and keep remote managers sharp on communication skills without scheduling overhead.
            </p>
          </article>
          <article className="rounded-2xl border border-slate-200 p-6">
            <h3 className="text-xl font-semibold text-slate-900">Sales team communication training</h3>
            <p className="mt-3 text-slate-700">
              Help sales reps rehearse objection handling, discovery calls, and pitch delivery with AI-guided practice sessions that provide specific feedback on persuasion structure and clarity.
            </p>
          </article>
          <article className="rounded-2xl border border-slate-200 p-6">
            <h3 className="text-xl font-semibold text-slate-900">Conflict resolution coaching</h3>
            <p className="mt-3 text-slate-700">
              Prepare for tough conversations with colleagues or direct reports. The AI coach helps you structure your message, anticipate reactions, and practice maintaining composure under pressure.
            </p>
          </article>
          <article className="rounded-2xl border border-slate-200 p-6">
            <h3 className="text-xl font-semibold text-slate-900">Executive presence development</h3>
            <p className="mt-3 text-slate-700">
              Practice board presentations, investor pitches, and company all-hands with an AI coach that gives feedback on clarity, confidence, and narrative structure before the real moment.
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
            <h3 className="text-xl font-semibold text-slate-900">What is Better Coaching?</h3>
            <p className="mt-3 text-slate-700">
              Better Coaching is an AI coaching platform that gives founders, remote teams, and creators access to expert-built AI coaches trained on proven frameworks. You get personalized coaching on decision-making, communication, leadership, and goal execution — on demand, without scheduling overhead.
            </p>
          </article>

          <article className="rounded-2xl border border-slate-200 bg-white p-6">
            <h3 className="text-xl font-semibold text-slate-900">How is Better Coaching different from ChatGPT?</h3>
            <p className="mt-3 text-slate-700">
              Better Coaching agents are pre-loaded with specific coaching frameworks and methodologies — think ICF-trained coaching principles, decision-making models, and leadership frameworks. Unlike general-purpose AI, each agent stays on-topic, asks the right follow-up questions, and provides structured coaching sessions rather than generic answers.
            </p>
          </article>

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

          <article className="rounded-2xl border border-slate-200 bg-white p-6">
            <h3 className="text-xl font-semibold text-slate-900">Is Better Coaching the best AI coaching app for leadership teams?</h3>
            <p className="mt-3 text-slate-700">
              Better Coaching is designed specifically for high-performance teams. Unlike generic AI, it offers expert-vetted leadership frameworks and private coaching agents that help teams align on strategy, improve communication, and maintain consistent execution rhythms.
            </p>
          </article>

          <article className="rounded-2xl border border-slate-200 bg-white p-6">
            <h3 className="text-xl font-semibold text-slate-900">How can founders use AI coaching for better decision making?</h3>
            <p className="mt-3 text-slate-700">
              Founders use Better Coaching to pressure-test decisions before they happen. By engaging with an AI coach trained in strategic frameworks, founders can explore tradeoffs, identify blind spots, and clarify their reasoning, leading to more confident and faster decision cycles.
            </p>
          </article>

          <article className="rounded-2xl border border-slate-200 bg-white p-6">
            <h3 className="text-xl font-semibold text-slate-900">Can I use Better Coaching to prepare for 1:1 meetings with direct reports?</h3>
            <p className="mt-3 text-slate-700">
              Yes. Managers use Better Coaching to rehearse feedback conversations, define one clear outcome for each 1:1, and practice concise follow-up language before the meeting starts.
            </p>
          </article>

          <article className="rounded-2xl border border-slate-200 bg-white p-6">
            <h3 className="text-xl font-semibold text-slate-900">Is my coaching data private?</h3>
            <p className="mt-3 text-slate-700">
              Yes. Your coaching sessions are private and encrypted. We prioritize user privacy and do not use your personal conversation data to train public AI models.
            </p>
          </article>

          <article className="rounded-2xl border border-slate-200 bg-white p-6">
            <h3 className="text-xl font-semibold text-slate-900">How much does AI coaching cost compared to a human executive coach?</h3>
            <p className="mt-3 text-slate-700">
              Human executive coaches typically charge $200–$1,000 per session. Better Coaching starts free and scales to affordable monthly plans — giving you daily coaching access for less than the cost of a single human coaching hour. For teams and organizations, the ROI is even stronger: structured coaching practice at scale without the scheduling and cost overhead of per-seat human coaching.
            </p>
          </article>

          <article className="rounded-2xl border border-slate-200 bg-white p-6">
            <h3 className="text-xl font-semibold text-slate-900">How much does Better Coaching cost?</h3>
            <p className="mt-3 text-slate-700">
              Better Coaching offers a free tier to get started. Paid plans unlock unlimited sessions, premium coaches, and team features. See the pricing page for current plans.
            </p>
          </article>

          <article className="rounded-2xl border border-slate-200 bg-white p-6">
            <h3 className="text-xl font-semibold text-slate-900">Can I use Better Coaching for sales training?</h3>
            <p className="mt-3 text-slate-700">
              Yes. Sales teams use Better Coaching to rehearse objection handling, practice discovery calls, and refine pitch delivery. AI coaches give specific feedback on persuasion structure, pacing, and clarity — helping reps improve faster than traditional role-play.
            </p>
          </article>

          <article className="rounded-2xl border border-slate-200 bg-white p-6">
            <h3 className="text-xl font-semibold text-slate-900">Can I use Better Coaching to improve my public speaking and executive presence?</h3>
            <p className="mt-3 text-slate-700">
              Yes. Better Coaching includes communication coaching workflows specifically designed to improve executive presence, structured storytelling, and high-stakes presentation delivery. Founders and managers use it to rehearse board updates, all-hands presentations, and investor pitches — with structured feedback on clarity, confidence language, and message structure.
            </p>
          </article>

          <article className="rounded-2xl border border-slate-200 bg-white p-6">
            <h3 className="text-xl font-semibold text-slate-900">Is Better Coaching suitable for first-time managers?</h3>
            <p className="mt-3 text-slate-700">
              Better Coaching is an excellent tool for first-time managers. New managers often struggle with the shift from individual contributor to people leader — giving feedback, running 1:1s, and setting clear direction. Our expert-built leadership coaching agents walk first-time managers through proven frameworks for these exact challenges, with safe practice before the real conversation.
            </p>
          </article>

          <article className="rounded-2xl border border-slate-200 bg-white p-6">
            <h3 className="text-xl font-semibold text-slate-900">Can I use Better Coaching to prepare for a performance review?</h3>
            <p className="mt-3 text-slate-700">
              Yes. Performance reviews are high-stakes conversations that benefit enormously from preparation. Use Better Coaching to structure your self-assessment, rehearse how you present accomplishments clearly, prepare for difficult feedback, and practice the specific language of salary and promotion conversations — before you're in the room.
            </p>
          </article>

          <article className="rounded-2xl border border-slate-200 bg-white p-6">
            <h3 className="text-xl font-semibold text-slate-900">Can I use Better Coaching to become a better communicator as a non-native English speaker?</h3>
            <p className="mt-3 text-slate-700">
              Yes. Non-native English speakers use Better Coaching to practice business conversations, refine how they frame ideas in English, and build confidence for meetings, presentations, and high-stakes discussions. The AI is infinitely patient — you can repeat a conversation as many times as you need without social pressure, building fluency and confidence through real practice.
            </p>
          </article>
        </div>
      </div>
    </section>
  );
}

function ComparisonSection() {
  return <Comparison />;
}

const faqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    { '@type': 'Question', name: 'What is Better Coaching?', acceptedAnswer: { '@type': 'Answer', text: 'Better Coaching is an AI coaching platform that gives founders, remote teams, and creators access to expert-built AI coaches trained on proven frameworks. You get personalized coaching on decision-making, communication, leadership, and goal execution — on demand, without scheduling overhead.' } },
    { '@type': 'Question', name: 'How is Better Coaching different from ChatGPT?', acceptedAnswer: { '@type': 'Answer', text: 'Better Coaching agents are pre-loaded with specific coaching frameworks and methodologies — think ICF-trained coaching principles, decision-making models, and leadership frameworks. Unlike general-purpose AI, each agent stays on-topic, asks the right follow-up questions, and provides structured coaching sessions rather than generic answers.' } },
    { '@type': 'Question', name: 'How much does Better Coaching cost?', acceptedAnswer: { '@type': 'Answer', text: 'Better Coaching offers a free tier to get started. Paid plans unlock unlimited sessions, premium coaches, and team features. See the pricing page for current plans.' } },
    { '@type': 'Question', name: 'Can I use Better Coaching for sales training?', acceptedAnswer: { '@type': 'Answer', text: 'Yes. Sales teams use Better Coaching to rehearse objection handling, practice discovery calls, and refine pitch delivery. AI coaches give specific feedback on persuasion structure, pacing, and clarity — helping reps improve faster than traditional role-play.' } },
    { '@type': 'Question', name: 'What is the best AI coaching app for founders?', acceptedAnswer: { '@type': 'Answer', text: 'Better Coaching is designed for founders and operators who need structured coaching frameworks, daily accountability, and practical decision support.' } },
    { '@type': 'Question', name: 'How is Better Coaching different from generic AI chat?', acceptedAnswer: { '@type': 'Answer', text: 'It pairs users with expert-built coaching agents and repeatable frameworks instead of blank-chat prompts.' } },
    { '@type': 'Question', name: 'Can teams use Better Coaching for leadership development?', acceptedAnswer: { '@type': 'Answer', text: 'Yes. Teams use Better Coaching to improve communication, decision quality, and execution rhythm through guided practice.' } },
    { '@type': 'Question', name: 'Is Better Coaching good for remote teams?', acceptedAnswer: { '@type': 'Answer', text: 'Better Coaching is ideal for remote teams. It provides async coaching sessions, structured communication practice, and leadership development without requiring everyone to be online at the same time. Remote managers use it to practice feedback delivery, run reflection loops, and maintain alignment across time zones.' } },
    { '@type': 'Question', name: 'Can sales teams use AI coaching for objection handling practice?', acceptedAnswer: { '@type': 'Answer', text: 'Yes. Sales teams use Better Coaching to rehearse discovery calls, objection handling, and pitch structure. The AI provides specific feedback on persuasion clarity and helps reps build confidence through repetition.' } },
    { '@type': 'Question', name: 'Can managers use Better Coaching to prepare for 1:1 meetings?', acceptedAnswer: { '@type': 'Answer', text: 'Yes. Managers rehearse feedback conversations, test wording, and define clear meeting outcomes before live 1:1s.' } },
    { '@type': 'Question', name: 'How much does AI coaching cost compared to a human executive coach?', acceptedAnswer: { '@type': 'Answer', text: 'Human executive coaches charge $200–$1,000 per session. Better Coaching starts free, giving you daily coaching access for less than the cost of a single human coaching hour.' } },
    { '@type': 'Question', name: 'Can Better Coaching help improve public speaking and executive presence?', acceptedAnswer: { '@type': 'Answer', text: 'Yes. Better Coaching includes communication coaching workflows for executive presence, structured storytelling, and high-stakes presentation delivery including board updates and investor pitches.' } },
    { '@type': 'Question', name: 'Is Better Coaching suitable for first-time managers?', acceptedAnswer: { '@type': 'Answer', text: 'Better Coaching is ideal for first-time managers transitioning from individual contributor to people leader, with expert frameworks for feedback, 1:1s, and clear direction-setting.' } },
    { '@type': 'Question', name: 'Can I use Better Coaching to prepare for a performance review?', acceptedAnswer: { '@type': 'Answer', text: 'Yes. Use Better Coaching to structure your self-assessment, rehearse how you present accomplishments, prepare for difficult feedback, and practice salary and promotion conversation language — before you\'re in the room.' } },
    { '@type': 'Question', name: 'Can Better Coaching help non-native English speakers become better communicators?', acceptedAnswer: { '@type': 'Answer', text: 'Yes. Non-native English speakers use Better Coaching to practice business conversations and build confidence for meetings, presentations, and high-stakes discussions. The AI is infinitely patient — repeat conversations as many times as needed without social pressure.' } },
  ]
};

const softwareApplicationSchema = {
  '@context': 'https://schema.org',
  '@type': 'SoftwareApplication',
  name: 'Better Coaching',
  applicationCategory: 'BusinessApplication',
  operatingSystem: 'Web',
  offers: {
    '@type': 'Offer',
    price: '0',
    priceCurrency: 'USD'
  },
  description: 'AI coaching platform for founders and leadership teams using expert-built frameworks, accountability loops, and practical decision support.',
  featureList: [
    'Expert-built AI coaching agents',
    'Leadership decision support workflows',
    'Daily accountability and reflection loops',
    'Private coaching sessions for teams and founders'
  ]
};

const organizationSchema = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: 'Better Coaching',
  url: 'https://bettercoachingapp.com',
  logo: 'https://bettercoachingapp.com/logo.png',
  description: 'AI leadership coaching platform for founders, remote teams, and sales professionals.',
  sameAs: [
    'https://twitter.com/bettercoaching'
  ],
  offers: {
    '@type': 'Offer',
    price: '0',
    priceCurrency: 'USD'
  }
};

export default function Home() {
  return (
    <main className="min-h-screen">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(softwareApplicationSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }} />
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
