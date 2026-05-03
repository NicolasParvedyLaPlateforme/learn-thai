import type {Metadata} from 'next';
import { Analytics } from "@vercel/analytics/next";
import { Inter, Sarabun } from 'next/font/google';
import './globals.css'; // Global styles

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-sans',
});

const sarabun = Sarabun({
  weight: ['400', '500', '600', '700'],
  subsets: ['thai'],
  variable: '--font-thai',
});

export const metadata: Metadata = {
  title: 'ThaiLearn',
  description: 'Apprenez le thaïlandais facilement',
};

export default function RootLayout({children}: {children: React.ReactNode}) {
  return (
    <html lang="en" className={`${inter.variable} ${sarabun.variable}`}>
       <body className="font-sans antialiased text-slate-900 bg-slate-50 min-h-screen" suppressHydrationWarning>
         {children}
         <Analytics />
       </body>
    </html>
  );
}
