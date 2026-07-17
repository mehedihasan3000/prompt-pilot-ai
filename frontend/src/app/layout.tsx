import type { Metadata } from 'next';
import { Plus_Jakarta_Sans } from 'next/font/google';
import { Providers } from './providers';
import '../styles/globals.css';

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700', '800'],
  display: 'swap',
  variable: '--font-plus-jakarta-sans',
});

export const metadata: Metadata = {
  title: {
    default: 'PromptPilot AI',
    template: '%s | PromptPilot AI',
  },
  description:
    'Write better AI prompts with an intelligent prompt optimization agent. Analyze, score, and optimize your prompts for ChatGPT, Claude, Gemini, and more.',
  keywords: ['AI prompts', 'prompt engineering', 'prompt optimization', 'ChatGPT', 'Claude', 'Gemini', 'AI tools'],
  authors: [{ name: 'PromptPilot AI' }],
  openGraph: {
    type: 'website',
    locale: 'en_US',
    siteName: 'PromptPilot AI',
    title: 'PromptPilot AI',
    description:
      'Write better AI prompts with an intelligent prompt optimization agent. Analyze, score, and optimize your prompts for ChatGPT, Claude, Gemini, and more.',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'PromptPilot AI',
    description:
      'Write better AI prompts with an intelligent prompt optimization agent. Analyze, score, and optimize your prompts for ChatGPT, Claude, Gemini, and more.',
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={plusJakartaSans.variable}>
      <body className="min-h-screen font-sans">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
