import type {Metadata} from 'next';
import { Inter, Noto_Sans_Thai } from 'next/font/google';
import './globals.css'; // Global styles

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-sans',
});

const notoSansThai = Noto_Sans_Thai({
  subsets: ['thai'],
  variable: '--font-thai',
});

export const metadata: Metadata = {
  title: 'ThaiLearn',
  description: 'Apprenez le thaïlandais facilement',
};

export default function RootLayout({children}: {children: React.ReactNode}) {
  return (
    <html lang="en" className={`${inter.variable} ${notoSansThai.variable}`}>
       <body className="font-sans antialiased text-slate-900 bg-slate-50 min-h-screen" suppressHydrationWarning>{children}</body>
    </html>
  );
}
