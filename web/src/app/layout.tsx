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
    'AI coaching',
    'coaching marketplace',
    'personal development',
    'coaching agents',
    'expert guidance',
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
