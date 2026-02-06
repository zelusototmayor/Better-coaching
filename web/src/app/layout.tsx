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
  title: 'Better Coaching - AI Coaching Marketplace',
  description:
    'Create AI coaching agents from your expertise, or discover the perfect coach for your journey. Real methodologies from real experts.',
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
    title: 'Better Coaching - AI Coaching Marketplace',
    description:
      'Create AI coaching agents from your expertise, or discover the perfect coach for your journey.',
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
                'Create AI coaching agents from your expertise, or discover the perfect coach for your journey.',
            }),
          }}
        />
        <MixpanelProvider>{children}</MixpanelProvider>
      </body>
    </html>
  );
}
