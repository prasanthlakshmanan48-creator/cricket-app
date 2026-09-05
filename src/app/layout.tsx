import type { Metadata } from 'next';
import './globals.css';
import { StadiumBackground } from '@/components/layout/StadiumBackground';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';

export const metadata: Metadata = {
  title: "Who's That Cricketer? - Global Cricket Guessing Game",
  description:
    'Think you know cricket? Prove it! Identify worldwide cricketers from progressive image reveals, clues, and statistics.',
  keywords: [
    'cricket game',
    'who are ya cricket',
    'cricdle',
    'cricket guess',
    'virat kohli',
    'cricket trivia',
    'ipl guessing game',
  ],
  manifest: '/manifest.json',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark scroll-smooth">
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&family=Space+Grotesk:wght@500;600;700;800&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-screen flex flex-col justify-between relative bg-[#0a0d12] text-slate-100 antialiased selection:bg-amber-500 selection:text-black">
        <StadiumBackground />
        <Navbar />
        <main className="relative z-10 flex-grow">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
