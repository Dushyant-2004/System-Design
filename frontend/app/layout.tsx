import type { Metadata } from 'next';
import './globals.css';
import Navbar from '@/components/Navbar';
import { Toaster } from 'sonner';

export const metadata: Metadata = {
  title: 'SysDesign AI - AI System Design Simulator',
  description:
    'Generate production-ready system architecture designs with AI. Microservices, databases, APIs, caching, scaling, and infrastructure — all visualized interactively.',
  keywords: ['system design', 'architecture', 'AI', 'microservices', 'software engineering'],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className="bg-dark-950 text-dark-100 min-h-screen antialiased">
        {/* Background effects */}
        <div className="fixed inset-0 pointer-events-none">
          {/* Gradient orbs */}
          <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-accent/5 rounded-full blur-[120px]" />
          <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-purple-500/5 rounded-full blur-[100px]" />
          {/* Grid overlay */}
          <div className="absolute inset-0 bg-grid-pattern bg-[size:40px_40px] opacity-100" />
        </div>

        <Navbar />
        <main className="relative pt-20 pb-16 min-h-screen">{children}</main>

        <Toaster
          position="bottom-right"
          theme="dark"
          toastOptions={{
            style: {
              background: '#202123',
              border: '1px solid #40414f',
              color: '#ececf1',
            },
          }}
        />
      </body>
    </html>
  );
}
