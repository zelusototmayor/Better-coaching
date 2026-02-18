import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { MixpanelProvider } from '@/components/MixpanelProvider';
import './globals.css';

const inter = Inter({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
});

export const metadata: Metadata = {
  metadataBase: new URL('https://bettercoachingapp.com'),
  title: 'Better Coaching | AI Coaching App for Founders, Leaders, and Creators',
  description:
    'AI coaching app for founders, leaders, and creators. Get expert-built coaching agents for decision-making, communication, and accountability.',
  alternates: {
    canonical: '/',
  },
  keywords: [
    'AI coaching app',
    'AI coaching app for founders',
    'AI leadership coaching',
    'coaching marketplace',
    'AI coaching for teams',
    'executive coaching AI',
    'best AI coaching app',
    'sales team coaching AI',
    'AI business coach',
    'coaching agents',
    'personal development AI',
    'AI coaching for managers',
    'remote team coaching app',
  ],
  openGraph: {
    title: 'Better Coaching | AI Coaching App for Founders, Leaders, and Creators',
    description:
      'AI coaching app for founders, leaders, and creators with expert-built agents for better decisions and execution.',
    url: 'https://bettercoachingapp.com/',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${inter.className} min-h-screen`}>
        <script
          type="application/ld+json"
          // eslint-disable-next-line react/no-danger
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'SoftwareApplication',
              name: 'Better Coaching',
              applicationCategory: 'BusinessApplication',
              operatingSystem: 'Web',
              url: 'https://bettercoachingapp.com/',
              description:
                'AI coaching app for founders, leaders, and creators with expert-built coaching agents and practical frameworks.',
            }),
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'FAQPage',
              mainEntity: [
                {
                  '@type': 'Question',
                  name: 'What is Better Coaching?',
                  acceptedAnswer: {
                    '@type': 'Answer',
                    text: 'Better Coaching is an AI-powered coaching marketplace where expert coaches create AI agents based on their real methodologies. Users can access personalized coaching 24/7 at a fraction of traditional coaching costs.',
                  },
                },
                {
                  '@type': 'Question',
                  name: 'How does AI coaching work on Better Coaching?',
                  acceptedAnswer: {
                    '@type': 'Answer',
                    text: 'Real coaches upload their frameworks, methods, and expertise. Our AI creates a coaching agent that can guide clients through their methodology — providing personalized advice, accountability, and structured growth plans anytime.',
                  },
                },
                {
                  '@type': 'Question',
                  name: 'Is AI coaching as effective as human coaching?',
                  acceptedAnswer: {
                    '@type': 'Answer',
                    text: 'AI coaching on Better Coaching is built from real expert methodologies, so you get proven frameworks delivered with infinite patience and availability. It excels at daily accountability, structured exercises, and on-demand guidance. For complex personal situations, many users combine AI coaching with periodic human sessions.',
                  },
                },
                {
                  '@type': 'Question',
                  name: 'Can I create my own AI coaching agent?',
                  acceptedAnswer: {
                    '@type': 'Answer',
                    text: 'Yes! If you are a coach, consultant, or expert, you can create an AI agent based on your unique methodology. Upload your frameworks, set your pricing, and reach clients globally without trading more hours for income.',
                  },
                },
                {
                  '@type': 'Question',
                  name: 'Is Better Coaching a good AI coaching app for founders?',
                  acceptedAnswer: {
                    '@type': 'Answer',
                    text: 'Yes. Founders use Better Coaching to prepare investor updates, pressure-test strategic decisions, and build consistent execution rhythms with expert-built coaching frameworks.',
                  },
                },
                {
                  '@type': 'Question',
                  name: 'How much does Better Coaching cost?',
                  acceptedAnswer: {
                    '@type': 'Answer',
                    text: 'Better Coaching offers free access to select coaching agents. Premium agents from top coaches are available through affordable subscriptions — typically 90% less than traditional 1-on-1 coaching sessions.',
                  },
                },
                {
                  '@type': 'Question',
                  name: 'What is the best AI coaching app for team leaders and managers?',
                  acceptedAnswer: {
                    '@type': 'Answer',
                    text: 'Better Coaching is designed specifically for team leaders who need to practice difficult conversations, improve communication clarity, and develop consistent management frameworks. Its expert-built agents provide structured coaching routines that managers can run daily — unlike generic AI chat tools that require you to build your own methodology from scratch.',
                  },
                },
                {
                  '@type': 'Question',
                  name: 'Can I use Better Coaching for sales team training?',
                  acceptedAnswer: {
                    '@type': 'Answer',
                    text: 'Yes. Sales teams use Better Coaching to practice objection handling, sharpen discovery questioning, and prepare for high-stakes pitches. The AI coaching agents can simulate realistic prospect scenarios, giving reps deliberate practice reps without needing a manager to roleplay with them.',
                  },
                },
                {
                  '@type': 'Question',
                  name: 'How does Better Coaching compare to hiring a business coach?',
                  acceptedAnswer: {
                    '@type': 'Answer',
                    text: 'A human business coach charges $200–$500 per session and is available once or twice a month. Better Coaching agents are available 24/7, built from real expert methodologies, and cost a fraction of the price. For daily accountability, reflection, and skill-building, AI coaching on Better Coaching delivers more consistent practice than infrequent human sessions.',
                  },
                },
                {
                  '@type': 'Question',
                  name: 'Does Better Coaching work for remote and distributed teams?',
                  acceptedAnswer: {
                    '@type': 'Answer',
                    text: 'Better Coaching is ideal for remote and distributed teams. Every team member can access the same expert-built coaching frameworks on their own schedule, creating alignment around communication standards, decision-making processes, and accountability habits — without requiring synchronous meetings.',
                  },
                },
              ],
            }),
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'Organization',
              name: 'Better Coaching',
              url: 'https://bettercoachingapp.com',
              description:
                'AI-powered coaching marketplace connecting expert coaches with clients through intelligent coaching agents.',
            }),
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'WebSite',
              name: 'Better Coaching',
              url: 'https://bettercoachingapp.com/',
              potentialAction: {
                '@type': 'SearchAction',
                target: 'https://bettercoachingapp.com/?q={search_term_string}',
                'query-input': 'required name=search_term_string',
              },
            }),
          }}
        />
        <MixpanelProvider>{children}</MixpanelProvider>
      </body>
    </html>
  );
}
