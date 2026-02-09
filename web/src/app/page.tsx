import {
  Navigation,
  Hero,
  ValuePillars,
  HowItWorks,
  Categories,
  FooterCTA,
} from '@/components/landing';
import { AuthRedirect } from '@/components/landing/AuthRedirect';

export default function Home() {
  return (
    <main className="min-h-screen">
      <AuthRedirect />
      <Navigation />
      <Hero />
      <ValuePillars />
      <HowItWorks />
      <Categories />
      <FooterCTA />
    </main>
  );
}
