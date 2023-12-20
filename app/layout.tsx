import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { ThemeProvider } from '@/components/theme-provider';
import { Analytics } from '@vercel/analytics/react';
import Head from 'next/head';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Text Tally - Real-Time Text Analysis & Word Count Tool',
  description:
    "Text Tally is a powerful, real-time text analysis tool that counts words, characters, and lines, calculates reading and speaking times, identifies key words, and much more. It's perfect for writers, students, SEO professionals, and anyone who needs to analyze text quickly and efficiently.",
  keywords: ['https://texttally.com'],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang='en'
      suppressHydrationWarning
      style={{ colorScheme: 'dark' }} // <--
      className='dark'>
      <Head>
        <script
          async
          src='https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-6041015149608797'
          crossOrigin='anonymous'></script>
      </Head>
      <body className={inter.className}>
        <ThemeProvider
          attribute='class'
          defaultTheme='dark'
          enableSystem>
          {children}
          <Analytics />
        </ThemeProvider>
      </body>
    </html>
  );
}
